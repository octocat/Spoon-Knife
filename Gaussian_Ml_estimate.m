function [m_hat,S_hat] = Gaussian_Ml_estimate(X)
%Maximum livelihood parameters estimation of the mutlivariate Gaussian 
%   distribution, based on data set X

% X: 1xN matrix,whose columns are the data vectors 


% Ouput: 
% m_hat: 1-dimensional estimate of themean vector of the distribution 
% S_hat: 1x1 estimate of the covariance matrix of thr distributiuon 


[1,N]=size(X);
m_hat=(1/N)* sum ( X')';
s_hat = zeros (1);
for  K= 1:N
    S_hat = S_hat+(X)