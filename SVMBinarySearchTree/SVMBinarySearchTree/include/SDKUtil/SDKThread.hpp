/**********************************************************************
Copyright ©2014 Advanced Micro Devices, Inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

•   Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
•   Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or
 other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
 OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
********************************************************************/
#ifndef _SDK_THREAD_H_
#define _SDK_THREAD_H

#ifdef _WIN32
#ifndef _WIN32_WINNT
#define _WIN32_WINNT 0x0501
#endif

/**
 * Header Files
 */
#include "windows.h"
#include <deque>
#include "assert.h"
#include <stdio.h>
#include <stdlib.h>
#ifdef _WIN32
#include <process.h>
#endif
#define EXPORT __declspec(dllexport)

#else
#include "pthread.h"
#define EXPORT
#endif

/**
 * suppress the warning #810 if intel compiler is used.
 */
#if defined(__INTEL_COMPILER)
#pragma warning(disable : 810)
#endif

//#define PRINT_COND_VAR_ERROR_MSG
#ifdef PRINT_COND_VAR_ERROR_MSG
#define PRINT_ERROR_MSG(errorcode, msg) \
    if(errorcode != 0) \
        printf("%s \n", msg)
#else
#define PRINT_ERROR_MSG(errorcode, msg)
#endif // PRINT_COND_VAR_ERROR_MSG

/**
 * namespace appsdk
 */
namespace appsdk
{
/**
 * Entry point for the thread
 * prototype of the entry point in windows
 */
typedef void* (*threadFunc)(void*);

//! pack the function pointer and data inside this struct
typedef struct __argsToThreadFunc
{
    threadFunc func;
    void* data;

} argsToThreadFunc;



/**
 * class ThreadLock
 *  \brief Provides a wrapper for locking primitives used to
 *   synchronize _CPU_ threads.
 *
 *  Common usage would be:
 *
 *     CALLock lock;
 *
 *     // Critical section begins
 *
 *     lock.lock();
 *
 * Critical section ends
 *
 *    lock.unlock();
 */

/**
 * class ThreadLock
 */
class EXPORT ThreadLock
{
    public:

        /**
         * Constructor
        */
        ThreadLock()
        {
#ifdef _WIN32
            InitializeCriticalSection(&_cs);
#else
            pthread_mutex_init(&_lock, NULL);
#endif
        }

        /**
         * Destructor
        */
        ~ThreadLock()
        {
#ifdef _WIN32
            DeleteCriticalSection(&_cs);
#else
            pthread_mutex_destroy(&_lock);
#endif
        }

        /**
         * Returns true if the lock is already locked, false otherwise
        */
        bool isLocked()
        {
#ifdef _WIN32
            return (_cs.LockCount != ~0x0);
#else
            if(pthread_mutex_trylock(&_lock) != 0)
            {
                return true;
            }
            pthread_mutex_unlock(&_lock);
            return false;
#endif
        }

        /**
         * Try to acquire the lock, if available continue, else wait on the lock
        */
        void lock()
        {
#ifdef _WIN32
            EnterCriticalSection(&_cs);
#else
            pthread_mutex_lock(&_lock);
#endif
        }

        /**
         * Try to acquire the lock, if available, hold it, else continue doing something else
        */
        bool tryLock()
        {
#ifdef _WIN32
            return (TryEnterCriticalSection(&_cs) != 0);
#else
            return !((bool)pthread_mutex_trylock(&_lock));
#endif
        }

        /**
         * Unlock the lock and return
        */
        void unlock()
        {
#ifdef _WIN32
            LeaveCriticalSection(&_cs);
#else
            pthread_mutex_unlock(&_lock);
#endif
        }

    private:

        /**
         * Private data members and methods
         */

        /**
         * System specific synchronization primitive
        */
#ifdef _WIN32
        CRITICAL_SECTION _cs;
#else
        pthread_mutex_t _lock;
#endif
};


/**
 * class Condition variable
 * Provides a wrapper for creating a condition variable
 * This class provides a simple wrapper to a condition variable
 */

class CondVarImpl;
class EXPORT CondVar
{
    public:
        /**
         * constructor and destructor.
         * Note that condition variable is not initialized in constructor
         * Separate functions available to initialize and destroy condition variable
         */
        CondVar();

        ~CondVar();

        /**
         * Initialize condition variable
         */
        bool init(unsigned int maxThreadCount);

        /**
         * Destroy condition variable
         */
        bool destroy();

        /**
         * Synchronize threads
         */
        void syncThreads();


    private:

        /**
         * Pointer to Implementation class
         */
        CondVarImpl* _condVarImpl;

};
#ifdef _WIN32
unsigned _stdcall win32ThreadFunc(void* args);
#endif
/**
 * \class Thread
 * \brief Provides a wrapper for creating a _CPU_ thread.
 * This class provides a simple wrapper to a CPU thread/
 */
class EXPORT SDKThread
{
    public:
        /**
         * Thread constructor and destructor. Note that the thread is
         * NOT created in the constructor. The thread creation takes
         *  place in the create method
        */
        SDKThread() : _tid(0), _data(0)
        {
        }

        ~SDKThread()
        {
#ifdef _WIN32
            if(_tid)
            {
                CloseHandle(_tid);
                _tid = 0;
            }
#endif
        }

        /**
         * Wrapper for pthread_create. Pass the thread's entry
         * point and data to be passed to the routine
        */
        bool create(threadFunc func, void* arg)
        {
            // Save the data internally
            _data = arg;
#ifdef _WIN32
            // Setup the callback struct for thread function and pass to the
            // begin thread routine
            // xxx The following struct is allocated but never freed!!!!
            argsToThreadFunc *args =  new argsToThreadFunc;
            args->func = func;
            args->data = this;
            _tid = (HANDLE)_beginthreadex(NULL, 0, win32ThreadFunc, args, 0, NULL);
            if(_tid == 0)
            {
                return false;
            }
#else
            //! Now create the thread with pointer to self as the data
            int retVal = pthread_create(&_tid, NULL, func, arg);
            if(retVal != 0)
            {
                return false;
            }
#endif
            return true;
        }

        /**
         * Wrapper for pthread_join. The calling thread
        * will wait until _this_ thread exits
        */
        bool join()
        {
            if(_tid)
            {
#ifdef _WIN32
                DWORD rc = WaitForSingleObject(_tid, INFINITE);
                CloseHandle(_tid);
                if(rc == WAIT_FAILED)
                {
                    printf("Bad call to function(invalid handle?)\n");
                }
#else
                int rc = pthread_join(_tid, NULL);
#endif
                _tid = 0;
                if(rc != 0)
                {
                    return false;
                }
            }
            return true;
        }

        /**
         * Get the thread data passed by the application
        */
        void* getData()
        {
            return _data;
        }

        /**
         * Get the thread ID
        */
        unsigned int getID()
        {
#if defined(__MINGW32__) && defined(__MINGW64_VERSION_MAJOR)
            //This is to fix compilation issue with MinGW64-w64
            return (unsigned int)(long long)_tid;
#else
            return (unsigned int)_tid;
#endif //__MINGW32__  and __MINGW64_VERSION_MAJOR
        }

    private:

        /**
         * Private data members and methods
         */

#ifdef _WIN32
        /**
         * store the handle
        */
        HANDLE _tid;
#else
        pthread_t _tid;
#endif

        void *_data;

};

#ifdef _WIN32
//! Windows thread callback - invokes the callback set by
//! the application in Thread constructor
unsigned _stdcall win32ThreadFunc(void* args)
{
    argsToThreadFunc* ptr = (argsToThreadFunc*) args;
    SDKThread *obj = (SDKThread *) ptr->data;
    ptr->func(obj->getData());
    delete args;
    return 0;
}
#endif

/**
 * CondVarImpl
 * class Implementation of Condition variable class
 * Provides Implementation of condition variable
 * Note that condition variable is not initialized in constructor
 * Separate functions available to initialize and destroy condition variable
 */

class CondVarImpl
{
    public:
        /**
         * Constructor
         */
        CondVarImpl() : _count(0xFFFFFFFF), _maxThreads(0xFFFFFFFF)
        {
        }


        /**
         * Destructor
         */
        ~CondVarImpl()
        {
        }

        /**
         * Initialize condition variable
         */
        bool init(unsigned int maxThreadCount)
        {
            int rc = 0;
            //! Initialize count and maxThreads
            _count = 0xFFFFFFFF;
            _maxThreads = maxThreadCount;
#ifdef _WIN32
            _nLockCount = 0;
            // Initialize the critical section that protects access to
            // the wait set. There is no way to check for errors here.
            InitializeCriticalSection(&_critsecWaitSetProtection);
            // Initialize the critical section that provides synchronization
            // to the client. There is no way to check for errors here.
            InitializeCriticalSection(&_condVarLock);
#else
            pthread_mutex_init(&_condVarLock, NULL);
            PRINT_ERROR_MSG(rc, "Failed to initialize condition variable lock");
            rc = pthread_cond_init(&_condVar, NULL);
            PRINT_ERROR_MSG(rc, "Failed to Initialize condition variable");
#endif
            if(rc != 0)
            {
                return false;
            }
            return true;
        }

        /**
         * Destroy condition variable
         */
        bool destroy()
        {
            int rc = 0;
#ifdef _WIN32
            // Uninitialize critical sections. Win32 allows no error checking
            // here.
            DeleteCriticalSection(&_critsecWaitSetProtection);
            DeleteCriticalSection(&_condVarLock);
            // Destroying this thing while threads are waiting is a client
            // programmer mistake.
            assert( _deqWaitSet.empty() );
#else
            //! Destroy condition variable lock
            pthread_mutex_destroy(&_condVarLock);
            PRINT_ERROR_MSG(rc, "Failed to destroy condition variable lock");
            //! Destroy condition variable
            rc = pthread_cond_destroy(&_condVar);
            PRINT_ERROR_MSG(rc, "Failed to destroy condition variable");
#endif
            if(rc != 0)
            {
                return false;
            }
            return true;
        }

        /**
         * Synchronize threads
         */
        void syncThreads()
        {
            //! Lock condition variable lock
            beginSynchronized();
            int rc = 0;
            //! count threads
            if(_count == 0xFFFFFFFF)
            {
                _count = 0;
            }
            else
            {
                _count++;
            }
            if(_count >= _maxThreads - 1)
            {
                //! Set to highest value before broadcasting
                _count = 0xFFFFFFFF;
                //! Unblock all waiting threads
#ifdef _WIN32
                rc = broadcast();
                if(rc == 0)
                {
                    printf("Problem while calling broadcast\n");
                }
#else
                rc = pthread_cond_broadcast(&_condVar);
                PRINT_ERROR_MSG(rc, "Problem while calling pthread_cond_broadcast()");
#endif // _WIN32
            }
            else
            {
                //! Block on a condition variable
#ifdef _WIN32
                wait();
#else
                if(_count < _maxThreads - 1)
                {
                    rc = pthread_cond_wait(&_condVar, &_condVarLock);
                    PRINT_ERROR_MSG(rc, "Problem while calling pthread_cond_wait()");
                }
#endif // _WIN32
            }
            //! Unlock condition variable lock
            endSynchronized();
        }


    private:

        /**
         * Acquires the lock once.
         */
        void beginSynchronized()
        {
#ifdef _WIN32
            // Acquire lock. Win32 allows no error checking here.
            EnterCriticalSection(&_condVarLock);
            // Record the lock acquisition for proper release in Wait().
            ++_nLockCount;
#else
            pthread_mutex_lock(&_condVarLock);
#endif // _WIN32
        }

        /**
         * Releases the lock once.
         */
        int endSynchronized()
        {
#ifdef _WIN32
            if(! _lockHeldByCallingThread())
            {
                ::SetLastError(ERROR_INVALID_FUNCTION); // for the lack of better...
                return 0;
            }
            // Record the lock release for proper release in Wait().
            --_nLockCount;
            // Release lock. Win32 allows no error checking here.
            ::LeaveCriticalSection(&_condVarLock);
#else
            pthread_mutex_unlock(&_condVarLock);
#endif // _WIN32
            return 1;
        }

#ifdef _WIN32

        /**
         * Waits for a notification.
         */
        DWORD wait(DWORD dwMillisecondsTimeout = INFINITE, BOOL bAlertable = FALSE)
        {
            if(! _lockHeldByCallingThread())
            {
                ::SetLastError(ERROR_INVALID_FUNCTION); // for the lack of better...
                return WAIT_FAILED;
            }
            // Enter a new event handle into the wait set.
            HANDLE hWaitEvent = _push();
            if(NULL == hWaitEvent)
            {
                return WAIT_FAILED;
            }
            // Store the current lock count for re-acquisition.
            int nThisThreadsLockCount = _nLockCount;
            _nLockCount = 0;
            // Release the synchronization lock the appropriate number of times.
            // Win32 allows no error checking here.
            for(int i = 0; i < nThisThreadsLockCount; ++i)
            {
                LeaveCriticalSection(&_condVarLock);
            }
            // NOTE: Conceptually, releasing the lock and entering the wait
            // state is done in one atomic step. Technically, that is not
            // true here, because we first leave the critical section and
            // then, in a separate line of code, call WaitForSingleObjectEx.
            // The reason why this code is correct is that our thread is placed
            // in the wait set *before* the lock is released. Therefore, if
            // we get preempted right here and another thread notifies us, then
            // that notification will *not* be missed: the wait operation below
            // will find the event signalled.
            // Wait for the event to become signalled.
            DWORD dwWaitResult = ::WaitForSingleObjectEx(hWaitEvent, dwMillisecondsTimeout,
                                 bAlertable);
            // If the wait failed, store the last error because it will get
            // overwritten when acquiring the lock.
            DWORD dwLastError = 0;
            if(WAIT_FAILED == dwWaitResult)
            {
                dwLastError = ::GetLastError();
            }
            // Acquire the synchronization lock the appropriate number of times.
            // Win32 allows no error checking here.
            for(int j = 0; j < nThisThreadsLockCount; ++j)
            {
                EnterCriticalSection(&_condVarLock);
            }
            // Restore lock count.
            _nLockCount = nThisThreadsLockCount;
            // Close event handle
            if(! CloseHandle(hWaitEvent))
            {
                return WAIT_FAILED;
            }
            if(WAIT_FAILED == dwWaitResult)
            {
                ::SetLastError(dwLastError);
            }
            return dwWaitResult;
        }

        /**
         * Notifies the waiting threads
         */
        BOOL broadcast()
        {
            // Signal all events on the deque, then clear it. Win32 allows no
            // error checking on entering and leaving the critical section.
            EnterCriticalSection(&_critsecWaitSetProtection);
            std::deque<HANDLE>::const_iterator it_run = _deqWaitSet.begin();
            std::deque<HANDLE>::const_iterator it_end = _deqWaitSet.end();
            for( ; it_run < it_end; ++it_run)
            {
                if(! SetEvent(*it_run))
                {
                    return FALSE;
                }
            }
            _deqWaitSet.clear();
            LeaveCriticalSection(&_critsecWaitSetProtection);
            return TRUE;
        }

        /**
         * Creates an initially non-signalled auto-reset event and
         * pushes the handle to the event onto the wait set. The
         * return value is the event handle. In case of failure,
         * NULL is returned.
         */
        HANDLE _push()
        {
            // Create the new event.
            HANDLE hWaitEvent = ::CreateEvent(NULL, // no security
                                              FALSE, // auto-reset event
                                              FALSE, // initially unsignalled
                                              NULL); // string name
            if(NULL == hWaitEvent)
            {
                return NULL;
            }
            // Push the handle on the deque.
            EnterCriticalSection(&_critsecWaitSetProtection);
            _deqWaitSet.push_back(hWaitEvent);
            LeaveCriticalSection(&_critsecWaitSetProtection);
            return hWaitEvent;
        }

        /**
         * Pops the first handle off the wait set. Returns NULL if the
         * wait set was empty.
         */
        HANDLE _pop()
        {
            // Pop the first handle off the deque.
            EnterCriticalSection(&_critsecWaitSetProtection);
            HANDLE hWaitEvent = NULL;
            if(0 != _deqWaitSet.size())
            {
                hWaitEvent = _deqWaitSet.front();
                _deqWaitSet.pop_front();
            }
            LeaveCriticalSection(&_critsecWaitSetProtection);
            return hWaitEvent;
        }

        /**
         * Checks whether the calling thread is holding the lock.
         */
        BOOL _lockHeldByCallingThread()
        {
            BOOL bTryLockResult = TryEnterCriticalSection(&_condVarLock);
            // If we didn't get the lock, someone else has it.
            if(!bTryLockResult)
            {
                return FALSE;
            }
            // If we got the lock, but the lock count is zero, then nobody had it.
            if(0 == _nLockCount)
            {
                assert(bTryLockResult);
                LeaveCriticalSection(&_condVarLock);
                return FALSE;
            }
            // Release lock once. NOTE: we still have it after this release.
            // Win32 allows no error checking here.
            assert(bTryLockResult && 0 < _nLockCount);
            LeaveCriticalSection(&_condVarLock);
            return TRUE;
        }


        /**
         * STL deque that implements the wait set.
         */
        std::deque<HANDLE> _deqWaitSet;

        /**
         * Critical section to protect access to wait set.
         */
        CRITICAL_SECTION _critsecWaitSetProtection;

        /**
         * Critical section for external synchronization.
         */
        CRITICAL_SECTION _condVarLock;

        /**
         * The monitor must keep track of how many times the lock
         * has been acquired, because Win32 does not divulge this
         * information to the client programmer.
         */
        int _nLockCount;

#else

        /**
         * condition variable
         */
        pthread_cond_t _condVar;

        /**
         * Mutex for condition variable _condVar
         */
        pthread_mutex_t _condVarLock;

#endif

        /**
         * Maximum threads in a group
         */
        unsigned int _maxThreads;

        /**
         * Number of threads waiting
         */
        unsigned int _count;

};

        CondVar::CondVar()
        {
            _condVarImpl = new CondVarImpl();
        }
        CondVar::~CondVar()
        {
            delete _condVarImpl;
        }

        /**
         * Initialize condition variable
         */
        bool CondVar::init(unsigned int maxThreadCount)
        {
            return _condVarImpl->init(maxThreadCount);
        }

        /**
         * Destroy condition variable
         */
        bool CondVar::destroy()
        {
            return _condVarImpl->destroy();
        }

        /**
         * Synchronize threads
         */
        void CondVar::syncThreads()
        {
            _condVarImpl->syncThreads();
        }


}

#endif // _CPU_THREAD_H_
