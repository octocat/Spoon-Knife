clear;clc();lines(0);
gg=gda();gg.font_size=2;gg.thickness=2;
//=============================================================================
//mass transfer in a flash tank
//km march 2015
//MAM3085F project
//=============================================================================
//read [roperty data file
Rg=101325*0.022414/273.15;  //Pa mol m3 K
critparm=readxls("properties.xls")
names=critparm(1)(2:$,1)
n=length(length(names));
formula=critparm(1)(2:$,2)
Mwt=critparm(1)(2:$,3)
Tc=critparm(1)(2:$,4);  //K
Pc=critparm(1)(2:$,5)*1e6; //Pa
Zc=critparm(1)(2:$,6);
Vc=Zc*Rg.*Tc./Pc;
Rg=101325*0.022414/273.15;  //pa m mol K
Vc=Rg*Tc.*Zc./Pc;  //m3/mol
wc=critparm(1)(2:$,7);
vl298=critparm(1)(2:$,8)*1e-6;  //m3/mol at 298K
Tb=critparm(1)(2:$,9);
Hf298=critparm(1)(2:$,11)*1e3;  //J/mol
Gf298=critparm(1)(2:$,12)*1e3;
Hvapb=critparm(1)(2:$,13)*1e3;
//DHvap1=DHvap2((1-Tr2)/(1-Tr1))^0.38
//vl=Vc*(Zc)^((1-Tr)^(2/7))

//mass transfer data
//-----------------------------------------------------------------------------
//gases k approx 0.2m/s, 298K, 1 atm, Wesselingh and Bollen, 1999
//--------------------------------------------------
//then use molecular weight correction sqrt(1/ma+1/mb)
//T dependence is T^1.75
kv0=1e-1/sqrt(1/Mwt(1)+1/Mwt(2))
for i=1:n
    for j=1:n
        kvij(i,j)=kv0*sqrt(1/Mwt(i)+1/Mwt(j))
    end
end
//liquids, k approx 2e-4 m/s
//---------------------------------------
//then use mwt(i)^0.5/vlb(j)^0.6 for correction 
//Vlb(j)=0.285e-6*(Vc(j)*1e6)^1.048 from Tyn and Calus Method (1975)
//T dependence is T
kl0=1e-4/Mwt(1)^0.5*(0.285e-6*(Vc(2)*1e6)^1.048)^0.6
for i=1:n
    for j=1:n
        klij(i,j)=kl0*Mwt(j)^0.5/(0.285e-6*(Vc(i)*1e6)^1.048)^0.6
    end
end
//note for liquids, D(i,j)<>D(j,i), thus take average
klij=(klij+klij')/2

//vapour pressure using Twu et al, 1994
function f=PvapTwu(Tr,Pc,w)
    i=find(Tr>=1)  //if above Tr=>1
    f(i)=Pc(i)
    i=find(Tr<1)  //if Tr<1
    Tr1=(1-Tr(i));Tr15=Tr1.^1.5;Tr3=Tr1.^3;Tr6=Tr1.^6;
    lnpr0=-5.96346*Tr1+1.17639*Tr15-0.559607*Tr3-1.31901*Tr6
    lnpr1=-4.78522*Tr1+0.413999*Tr15-8.91239*Tr3-4.98662*Tr6
    f(i)=Pc(i).*exp((lnpr0+w(i).*lnpr1)./Tr(i))
endfunction

//equilibrium flash calculation
function f=flash(w)
    //there are 2n+2 variables
    //w=[V,yi,xi,L];
    V=w(1);yi=w(2:n+1);xi=w(n+2:2*n+1);L=w(2*n+2);
    //overall mass balance
    f(1)=Ftv+Ftl-V-L;
    //component mass balances
    f(2:n+1)=Ftv*zf+Ftl*zf-V*yi-L*xi;
    //equilibrium
    f(n+2:2*n+1)=yi-Ki.*xi;
    //summation
    f(2*n+2)=sum(yi-xi);
endfunction

//Maxwell stefan mass transfer limited flash calculation
function f=masst(w)
    //disp(w'), there are 5n+2 variables
    V=w(1);yi=w(2:n+1);yii=w(n+2:2*n+1);xii=w(2*n+2:3*n+1);L=w(3*n+2);
    xi=w(3*n+3:4*n+2);Ni=w(4*n+3:5*n+2);
    //overall vapour phase
    f1=Ftv-V+Sarea*sum(Ni);  //1
    //vapour component mass balance
    f2=Ftv*zf-V*yi+Sarea*Ni;  //n
    //gas phase mass transfer, from interface to bulk
    ym=(yii+yi)/2;
    dy(1:n-1)=0
    for i=1:n-1
        for j=1:n
            if i<>j then
                dy(i)=dy(i)+(ym(i)*Ni(j)-ym(j)*Ni(i))/kvij(i,j)
            end
        end;
    end;
    f3=ctv*(yi(1:n-1)-yii(1:n-1))-dy;  //n-1
    //vapour interface summation
    f4=sum(yii)-1;  //1
    //interface
    f5=yii-Ki.*xii;  //n
    //overall liquid balance
    f6=Ftl-L-Sarea*sum(Ni);  //1
    //liquid component balances
    f7=Ftl*zf-L*xi-Sarea*Ni;  //n
    //liquid phase mass transfer from bulk to interface
    xm=(xii+xi)/2;
    ctl=1/sum(xm.*vl298);  //liquid molar density, depends on composition
    dx(1:n-1)=0
    for i=1:n-1
        for j=1:n
            if i<>j then
                dx(i)=dx(i)+(xm(i)*Ni(j)-xm(j)*Ni(i))/klij(i,j)
            end
        end;
    end;
    f8=ctl*(xii(1:n-1)-xi(1:n-1))-dx;  //n-1
    //vapour interface summation
    f9=sum(xii)-1;  //1
    //error vector
    f=[f1;f2;f3;f4;f5;f6;f7;f8;f9];
endfunction

//==============================================================================
//problem conditions
feed=[0.0315661    0.0901577    0.1089685    0.1153033]';
Ft=sum(feed);
//---------------------------------------------------
//the feed split is set here
Ftv=0.5*Ft;
Ftl=Ft-Ftv;   //split feed with the same composition
//---------------------------------------------------
//feed=[1 1 1 1]';
zf=feed/sum(feed);
Pt=101325*1;  //Pa
T=273+90;  //K
Tr=T./Tc;
Pvap=PvapTwu(Tr,Pc,wc);
Ki=Pvap./Pt;
ctv=Pt/Rg/T;  //gas molar density
ctl=1/sum(zf.*vl298);  //liquid molar density, constant for now
Sarea=1;  //bubble surface area for mass transfer
kvij=kvij*101325/Pt*(T/298)^1.75;
klij=klij*(T/298)
printf('\nConditions for the mass transfer limited flash tank\n');
printf('Pressure =                    %5.1f atm\n',Pt/101325);
printf('Temperature =                 %5.1f C\n',T-273);
printf('feed vapour fraction Ftv/Ft = %5.3f\n',Ftv/Ft);
printf('name           Ft       Ftv      Ftl\n');
printf('%s  %7.4f  %7.4f  %7.4f\n',names,feed,Ftv*zf,Ftl*zf);



//------------------------------------------------------------------------------
//intial guess using psi=0.5
psi=0.5;
xi0=zf./(1+psi*(Ki-1));
yi0=Ki.*xi0
V0=psi*(Ftl+Ftv);L0=(Ftl+Ftv)-V0;

//------------------------------------------------------------------------------
//equilibrium flash
w0=[V0; yi0; xi0; L0];
[w,ff,info]=fsolve(w0,flash)
printf('\nequilibrium flash\n');
printf('error=%10.2E     info=%2i\n',norm(ff)/(2*n+2),info);
V=w(1);yi=w(2:n+1);xi=w(n+2:2*n+1);L=w(2*n+2);
psim=V/(Ftl+Ftv);
printf(' name            yi        xi\n');
printf('%10s  %8.4f  %8.4f\n',names,yi,xi);
printf('V/F=%8.4f\n',psim);

//------------------------------------------------------------------------------
//flash with mass transfer
//w=[V,yi,yii,xii,L,xi,Ni];

Ni0=ones(n,1)*1e-2
w0=[V; yi; (zf+yi)*0.5; (zf+xi)*0.5; L; xi; Ni0];
[w,ff,info]=fsolve(w0,masst)
//disp(w);
printf('\nnon-equilibrium flash\n');
printf('error=%10.2E     info=%2i\n',norm(ff)/(5*n+2),info);
V=w(1);yi=w(2:n+1);yii=w(n+2:2*n+1);xii=w(2*n+2:3*n+1);L=w(3*n+2);
xi=w(3*n+3:4*n+2);Ni=w(4*n+3:5*n+2);
psi=V/(Ftl+Ftv);
printf(' name            yi        xi        yii       xii       Ni\n');
printf('%10s  %8.4f  %8.4f  %8.4f  %8.4f  %9.5f\n',names,yi,xi,yii,xii,Ni);
printf('V/F=%8.4f\n',psi);

printf('approach to equilibrium: %8.4f\n',psi/psim);
//disp(V*yi/Sarea)

