/**********************************************************************
Copyright ©2014 Advanced Micro Devices, Inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

•	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
•	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or
 other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
 OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
********************************************************************/

/* binary tree node definition */
typedef struct nodeStruct
{
  int value;
  __global struct nodeStruct* left;
  __global struct nodeStruct* right;
} node;

/* search keys */
typedef struct searchKeyStruct
{
  int      key;
  __global node* oclNode;
  __global node* nativeNode;
} searchKey;

/***
 * sample_kernel:
 ***/
__kernel void sample_kernel(__global void* bstRoot,
			    __global void* searchKeyVect)
{
  __global node*      searchNode  = (__global node *)(bstRoot);
  __global searchKey* keyPtr      = (__global searchKey*)(searchKeyVect); 
  int                 gid         =  get_global_id(0);
  __global searchKey* currKey     = keyPtr + gid;

  while(NULL != searchNode)
    {
      if(currKey->key == searchNode->value)
	{
	  /* rejoice on finding key */
	  currKey->oclNode   = searchNode;
	  searchNode         = NULL;
	}
      else if(currKey->key < searchNode->value)
	{
	  /* move left */
	  searchNode = searchNode->left;
	}
      else
	{
	  /* move right */
	  searchNode = searchNode->right;
	}
    }
}

