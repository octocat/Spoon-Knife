#include <stdio.h>
//#include "vector.h"
#define VECTOR_INIT_CAPACITY 10
typedef struct dynamic_vector
{
void** data;
int size; // Total size of the vector
int capacity; //Number of vectors in it at present
} vectorv;

void initialize(vectorv *v)
{
  v->data=(void*)malloc(sizeof(void *) * v->capacity);
  v->capacity=VECTOR_INIT_CAPACITY;
  v->size=0;
}

void resize(vectorv *v)
{
    int r=v->size/v->capacity;
    if(r>0.9)
    {
        v=realloc(v,sizeof(void*)* v->capacity*2);
    }
    else if(r<0.4)
    {
        v=realloc(v,sizeof(void *)*v->capacity/2);
    }
}
void add(vectorv *v,void *n)
{
    resize(&v);
    v->data[v->size]=n;
    v->size++;

}

void del(vectorv *v)
{
    free(v->data[v->size]);
    v->size--;
}

void printdata(vectorv *v)
{
    int i;
    for(i=0;i<v->size;i++)
    {
        printf("%d ",*v->data);
    }
}
int main()
{
    vectorv v;
    initialize(&v);
    add(&v,5);
    printdata(&v);


}
