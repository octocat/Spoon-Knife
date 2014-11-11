// Copyright 1998-2014 Epic Games, Inc. All Rights Reserved.

#pragma once

#include "Core.h"
#include "ModuleInterface.h"

/**
 *	Package dependency information class.
 *	Generates and maintains a list of dependency and timestamp information for packages.
 *	Primarily intended for use during cooking.
 */
class FPackageDependencyInfo
{
	friend class FPackageDependencyInfoModule;

public:
	static FString ScriptSourcePkgName;
	static FString ShaderSourcePkgName;

	FPackageDependencyInfo() {};

	/** 
	 *	Initialize the class
	 *
	 *	@param	bInPreProcessAllFiles		If true, pre-process all content files at initialization
	 */
	void Initialize(bool bInPreProcessAllFiles);

	/**
	 *	Determine the given packages dependent time stamp
	 *
	 *	@param	InPackageName		The package to process
	 *	@param	OutNewestTime		The dependent time stamp for the package.
	 *
	 *	@return	bool				true if successful, false if not
	 */
	bool DeterminePackageDependentTimeStamp(const TCHAR* InPackageName, FDateTime& OutNewestTime);

	/**
	 *	Determine dependent timestamps for the given list of files
	 *
	 *	@param	InPackageList		The list of packages to process
	 */
	void DetermineDependentTimeStamps(const TArray<FString>& InPackageList);

	/**
	 *	Determine all found content files dependent timestamps
	 */
	void DetermineAllDependentTimeStamps();

protected:
	/** Determine the newest shader source time stamp */
	void DetermineShaderSourceTimeStamp();

	/** Determine the newest 'script' time stamp */
	void DetermineScriptSourceTimeStamp();

	/** Determine the newest engine 'script' time stamp */
	void DetermineEngineScriptSourceTimeStamp();

	/** Determine the newest game 'script' time stamp */
	void DetermineGameScriptSourceTimeStamp();

	/**
	 *	Determine the newest 'script' source file for either the game or the engine
	 *
	 *	@param	bInGame				true if looking at game script, false if engine
	 *	@param	OutNewestTime		OUTPUT - the timestamp of the newest 'script' file
	 */
	void DetermineScriptSourceTimeStamp(bool bInGame, FDateTime& OutNewestTime);

	/** Prep the content package list - ie gather the list of all content files and their actual timestamps */
	void PrepContentPackageTimeStamps();

	/**
	 *	Recursively process the given package to determine the dependent timestamp - ie its newest dependency
	 *
	 *	@param	InPackageName				The name of the source package
	 *	@param	OutNewestTime				OUTPUT - The dependent timestamp for the package
	 *	@param	bOutHadCircularReferences	OUTPUT - true if any circular dependencies were encountered
	 */
	void RecursiveDeterminePackageDependentTimeStamp(const TCHAR* InPackageName, FDateTime& OutNewestTime, bool& bOutHadCircularReferences);

	/**
	 *	Resolve the circular dependencies in the given info
	 *
	 *	@param	InPkgInfo		The package dependency tracking info containing the circular references
	 */
	void ResolveCircularDependencies(FPackageDependencyTrackingInfo* InPkgInfo);
	void ResolveCircularDependenciesInnerFast();


	/** Prepares the internal structures to be ready for working with a new package. */
	void PrepareForNewPackage();

	/** The newest time stamp of the shader source files. Used when a package contains a material */
	FDateTime ShaderSourceTimeStamp;
	/** The newest shader source file - for informational purposes only */
	FString NewestShaderSource;
	/** The pkg info for shader source */
	FPackageDependencyTrackingInfo* ShaderSourcePkgInfo;

	/** The newest time stamp of the engine 'script' source files. Used when a package contains a blueprint */
	FDateTime EngineScriptSourceTimeStamp;
	/** The newest engine 'script' source file - for informational purposes only */
	FString NewestEngineScript;
	/** The newest time stamp of the game 'script' source files. Used when a package contains a blueprint */
	FDateTime GameScriptSourceTimeStamp;
	/** The newest script source time stamp */
	FDateTime ScriptSourceTimeStamp;
	/** The pkg info for script source */
	FPackageDependencyTrackingInfo* ScriptSourcePkgInfo;

	/** The package information, including dependencies for content files */
	TMap<FString,class FPackageDependencyTrackingInfo*> PackageInformation;

	/** All packages for the currently processing package. */
	TSet<FPackageDependencyTrackingInfo*> AllPackages;

	/** All resolved circular dependencies for the currently processing package, mostly for debugging purpose only. */
	TSet<FPackageDependencyTrackingInfo*> ResolvedCircularDependencies;

	/** How many passes we needed to resolve the circular dependencies. */
	int64 NumResolvePasses;
	/** How many iterations we needed to resolve the circular dependencies. */
	int64 NumResolveIterations;
	/** How many circular dependencies we found during the resolve. */
	int64 NumCirculars;
};
