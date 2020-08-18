// Utility function: takes operator op
// op must be a function of a vector, producing a vector
// and op must be linear i.e. op(a + b) = op(a) + op(b)
// and op(k*a)=k*op(b)
// result: matrix m representation of op
// i.e op(x) = m * x
// simple linear algebra: m consists of columns op(ei)
// where ei is a basis vector
clc;clear
function m = mkMatrix(n, op)
    m = zeros(n,n);
    e = eye(n,n); // all basis vectors
    for i=1:n do
        m(:,i) = op(e(:,i)) // apply op to e_i
    end
endfunction

function w=ff(v)
    n = length(v);
    w = zeros(n,1);
    for i=1:(n-1) do
        w(i) = 3*v(i) -v(i+1);
    end
    w(n) = v(n);
endfunction

m = mkMatrix(5,ff);
v = [2;1;4;5;1];
sol = m \ v;

// Represent each block of our system:
// each block takes a incoming flow (or flows)
// and produces resulting flow(s)

function f2 = mixer(f1, f7)
    f2 = f1 + f7;
endfunction

function f3 = reactor(X,f2)
    S = [-1/3 -1 1/3 1/3 0]';
    change = X * f2(2) * S;
    f3 = f2 + change;
endfunction

// takes a splitting vector Alpha
function [f4, f5] = condenser(Alpha, f3)
    f5 = Alpha .* f3;
    f4 = (1 - Alpha) .* f3;
endfunction

// takes a purge fuctor Beta
function [f6, f7] = purger(Beta, f5)
    f6 = Beta * f5;
    f7 = (1-Beta)*f5;
endfunction

// utility: get constituents out of the overall flow
function [f1, f2, f3, f4, f5, f6, f7] = splitFlow(F)
    f1 = F(1:5);
    f2 = F(6:10);
    f3 = F(11:15);
    f4 = F(16:20);
    f5 = F(21:25);
    f6 = F(26:30);
    f7 = F(31:35);
endfunction

// A
// for each block OUT = blockFunction(IN)
// where IN and OUT are all parts of F
// thus, mass balance is OUT - blockFunction(IN)
// + constraints. In this case we specify the feed f1
// thus the constraint is simple: f1 -> f1
function b = massBalanceA(F)
    Alpha = [1,1,0,0,1]';
    Beta  = 0.12281;
    X = 0.6;
    [f1, f2, f3, f4, f5, f6, f7] = splitFlow(F);
    F2 = mixer(f1,f7);
    F3 = reactor(X, f2);
    [F4 F5] = condenser(Alpha,f3);
    [F6 F7] = purger (Beta,f5);
    b2 = F2 - f2;             // mixer mass balance
    b3 = F3 - f3;             // reactor mass balance
    b4 = F4 - f4;             // condenser for f4
    b5 = F5 - f5;             // condenser for f5
    b6 = F6 - f6;             // purger for f6
    b7 = F7 - f7;             // purger for f7
    c = f1;                   // constraint
    b = [b2;b3;b4;b5;b6;b7;c];
endfunction


// RHS of mass balance
feed = [0.249 0.747 0 0 0.004]';

// for all but last bit, bA must be 0 (to satisfy mass balance)
bA = [zeros(30,1); feed];

AA = mkMatrix(35, massBalanceA);
FA = AA \ bA;

[f1A, f2A, f3A, f4A, f5A, f6A, f7A] = splitFlow(FA);

factorA = 155 / f4A(3);
FAfinal = factorA * FA;


// B
// the only change is the constraint: wwe specify f2(1), f2(2), f1(3), f1(4)
// and use mol fraction of inerts in f1 (feed) x15 = 0.004
// x15 = f15/(sum f1), i.e. f15 - x15 * sum(f1) = 0
function b = massBalanceB(F)
    Alpha = [1,1,0,0,1]';
    Beta = 0.12281;
    X = 0.004;
    [f1, f2, f3, f4, f5, f6, f7] = splitFlow(F);
    F2 = mixer(f1,f7);
    F3 = reactor(X,f2);
    [F4 F5] = condenser(Alpha,f3);
    [F6 F7] = purger (Beta,f5);
    b2 = F2 - f2;
    b3 = F3 - f3;
    b4 = F4 - f4;
    b5 = F5 - f5;
    b6 = F6 - f6;
    b7 = F7 - f7;
    x = 0.004;
    cLast = f1(5) - x * sum(f1);
    c = [f2(1); f2(2); f1(3); f1(4); cLast];
    b = [b2;b3;b4;b5;b6;b7;c];
endfunction

// f21 = 28, f22 = 70, f13=f14=0 and the constraint on inerts
bB = [zeros(30,1); [28; 70; 0; 0; 0]];
AB = mkMatrix(35, massBalanceB);
FB = AB \ bB;

[f1B, f2B, f3B, f4B, f5B, f6B, f7B] = splitFlow(FB);

factorB = 155 / f4B(3);
FBfinal = factorB * FB;
//=================================================================
//Tutorial 7 Question 1
//=================================================================
x=1:1:7;//Stream counter
names=['CO2' 'H2' 'CH3OH' 'H2O' 'Inerts']';//Components
flow=['Component/Flow' 'kmol/hr' 'kmol/hr' 'kmol/hr' 'kmol/hr' 'kmol/hr' 'kmol/hr' 'kmol/hr'];//Flow units
frac=['Component/Molfrac' '[-]' '[-]' '[-]' '[-]' '[-]' '[-]' '[-]'];//mole frac units (dimensionless)
fr=[f1B./sum(f1B) f2B./sum(f2B) f3B./sum(f3B) f4B./sum(f4B) f5B./sum(f5B) f6B./sum(f6B) f7B./sum(f7B)];//Mole fracs
total=[sum(f1B) sum(f2B) sum(f3B) sum(f4B) sum(f5B) sum(f6B) sum(f7B)];//Total flows for each stream
csvWrite(['Stream' string(x);flow;names string([f1B f2B f3B f4B f5B f6B f7B]);'Total' string(total);frac;names string(fr)],'streamtable_q1.csv');

//=================================================================
//Tutorial 7 Question 2
//=================================================================

x=[];A=[];b=[];F=[];
A=[1 1 1;0.04 0.54 0.26;0.93 0.24 0];
b=[10 2 6]';
x1=[0.2 0.6 0.2]';x2=[0.04 0.93 0.03]';x3=[0.54 0.24 0.22]';x4=[0.26 0 0.74]';
F=A\b;
F1=10;F2=F(1);F3=F(2);F4=F(3);
x=1:1:4;
flow2=['Component/Flow' 'mol/s' 'mol/s' 'mol/s' 'mol/s'];
comps=['Species 1' 'Species 2' 'Species 3']';
frac2=['Component/Molfrac' '[-]' '[-]' '[-]' '[-]'];
flows=[F1.*x1 F2.*x2 F3.*x3 F4.*x4];//Species flows for each stream
csvWrite(['Stream' string(x);flow2;comps string(flows);'Total' string([F1 F2 F3 F4]);frac2;comps string([x1 x2 x3 x4])],'streamtable_q2.csv');
