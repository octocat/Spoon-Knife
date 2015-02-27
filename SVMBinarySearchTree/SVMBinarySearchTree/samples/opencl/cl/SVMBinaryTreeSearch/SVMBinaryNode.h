#ifndef __SVM_BINARY_NODE__
#define __SVM_BINARY_NODE__

/* binary tree node definition */
typedef struct nodeStruct
{
  int value;
  struct nodeStruct* left;
  struct nodeStruct* right;
} node;

/* search keys */
typedef struct searchKeyStruct
{
  int   key;
  node* oclNode;
  node* nativeNode;
} searchKey;

#endif
