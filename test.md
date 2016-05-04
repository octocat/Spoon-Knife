#include <errno.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <stdlib.h>
#include <string.h>
#include <netinet/in.h>
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>

int main(int argc, char **argv)
{
    setbuf(stdout, NULL);
    //fflush(stdout);
    printf("server ip: %s\n", argv[1]);
    printf("server port: %s\n", argv[2]);

    printf("\n service starting...\n\n");
    int     socketFd;
    struct sockaddr_in svrAddr;
    struct sockaddr_in localAddr;

    socketFd = socket (AF_INET, SOCK_DGRAM, 0);
    if ( -1 == socketFd )
    {
        perror( "socket:" );
        exit(-1);
    }

    // 设置地址可复用
    int option = 1;
    setsockopt( socketFd, SOL_SOCKET, SO_REUSEADDR, &option, sizeof(option) );
    // 客户端IP
    memset(&localAddr, 0, sizeof(localAddr));
    localAddr.sin_family = AF_INET;
    localAddr.sin_addr.s_addr = inet_addr( argv[1]);
    localAddr.sin_port = htons (atoi(argv[2]));

    int bindResult = bind(socketFd, (struct sockaddr *) &localAddr, sizeof(localAddr));
    if ( -1 == bindResult )
    {
        perror( "bind:" );
        close(socketFd);
        exit(-1);
    }

    // 服务器IP
    /*memset(&svrAddr, 0, sizeof(svrAddr));
    svrAddr.sin_family = AF_INET;
    svrAddr.sin_addr.s_addr = inet_addr( argv[1]);
    svrAddr.sin_port = htons (atoi(argv[2]));*/
    char tempBuff[2048] = {0};

    for ( ; ; )
    {
        // 接收数据
        struct sockaddr_in  fromAddr;
        memset((char *)&fromAddr, 0, (int)sizeof(fromAddr));
        socklen_t fromLen = sizeof(fromAddr);
        ssize_t result = recvfrom(   socketFd, tempBuff, sizeof(tempBuff), 0, (struct sockaddr *)&fromAddr, &fromLen);    
        if ( -1 == result )
        {
            perror("recvfrom:");
            continue;
        }
        else
        {
            printf( "recv data %s successed. data len: %d\n", inet_ntoa(fromAddr.sin_addr), result );
            printf( "data:\n");
            for ( int i = 0; i < result; i++ )
            {
                printf( "%02x ", tempBuff[i] );
                if ( (i+1)%16 == 0 )
                {
                    printf( "\n" );
                }
            }
            printf( "\n" );
        }
        
        // 发送数据
        result = sendto( socketFd, tempBuff, result, 0, (struct sockaddr*)&fromAddr, sizeof(fromAddr));
        if ( -1 == result )
        {
            perror("sendto:");
        }
        else
        {
            printf("send data success. data len:%d\n", result );
        }        
        //sleep( 60 );
    }
    close(socketFd);
}