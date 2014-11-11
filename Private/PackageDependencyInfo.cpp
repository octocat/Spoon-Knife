// Copyright 1998-2014 Epic Games, Inc. All Rights Reserved.

#include "PackageDependencyInfoPrivatePCH.h"
#include "PackageDependencyInfoPrivate.h"
#include "PackageDependencyInfo.h"
#include "ModuleManager.h"

IMPLEMENT_MODULE( FPackageDependencyInfoModule, PackageDependencyInfo );

DEFINE_LOG_CATEGORY_STATIC(LogPackageDependencyInfo, Log, All);

/**
 * Visitor to gather local files with their timestamps
 */
class FPackageDependencyTimestampVisitor : public IPlatformFile::FDirectoryVisitor
{
private:
	/** The file interface to use for any file operations */
	IPlatformFile& FileInterface;

	/** true if we want directories in this list */
	bool bCacheDirectories;

	/** 
	 *	A list of directories wildcards that must be in the path to process the folder
	 *	If empty, it will process all directories found
	 */
	TArray<FString> DirectoriesWildcards;

	/** A list of directories that we should not traverse into */
	TArray<FString> DirectoriesToIgnore;

	/** A list of directories that we should only go one level into */
	TArray<FString> DirectoriesToNotRecurse;

public:
	/** Relative paths to local files and their timestamps */
	TMap<FString, FDateTime> FileTimes;
	
	FPackageDependencyTimestampVisitor(IPlatformFile& InFileInterface, const TArray<FString>& InDirectoriesWildcards, 
		const TArray<FString>& InDirectoriesToIgnore, const TArray<FString>& InDirectoriesToNotRecurse, bool bInCacheDirectories=false)
		: FileInterface(InFileInterface)
		, bCacheDirectories(bInCacheDirectories)
	{
		for (int32 DirIndex = 0; DirIndex < InDirectoriesWildcards.Num(); DirIndex++)
		{
			FString Dir = InDirectoriesWildcards[DirIndex];
			Dir.ReplaceInline(TEXT("\\"), TEXT("/"));
			DirectoriesWildcards.Add(Dir);
		}

		// make sure the paths are standardized, since the Visitor will assume they are standard
		for (int32 DirIndex = 0; DirIndex < InDirectoriesToIgnore.Num(); DirIndex++)
		{
			FString DirToIgnore = InDirectoriesToIgnore[DirIndex];
			FPaths::MakeStandardFilename(DirToIgnore);
			DirectoriesToIgnore.Add(DirToIgnore);
		}

		for (int32 DirIndex = 0; DirIndex < InDirectoriesToNotRecurse.Num(); DirIndex++)
		{
			FString DirToNotRecurse = InDirectoriesToNotRecurse[DirIndex];
			FPaths::MakeStandardFilename(DirToNotRecurse);
			DirectoriesToNotRecurse.Add(DirToNotRecurse);
		}
	}

	virtual bool Visit(const TCHAR* FilenameOrDirectory, bool bIsDirectory)
	{
		// make sure all paths are "standardized" so the other end can match up with it's own standardized paths
		FString RelativeFilename = FilenameOrDirectory;
		FPaths::MakeStandardFilename(RelativeFilename);

		// cache files and optionally directories
		if (!bIsDirectory)
		{
			if (DirectoriesWildcards.Num() > 0)
			{
				// If it is a file, and it does not contain one of the directory wildcards, skip it
				for (int32 DirIndex = 0; DirIndex < DirectoriesWildcards.Num(); DirIndex++)
				{
					if ( RelativeFilename.Contains(DirectoriesWildcards[DirIndex]) )
					{
						FileTimes.Add(RelativeFilename, FileInterface.GetTimeStamp(FilenameOrDirectory));
						break;
					}
				}
			}
			else
			{
				FileTimes.Add(RelativeFilename, FileInterface.GetTimeStamp(FilenameOrDirectory));
			}
		}
		else if (bCacheDirectories)
		{
			// we use a timestamp of 0 to indicate a directory
			FileTimes.Add(RelativeFilename, 0);
		}

		// iterate over directories we care about
		if (bIsDirectory)
		{
			bool bShouldRecurse = true;
			// look in all the ignore directories looking for a match
			for (int32 DirIndex = 0; DirIndex < DirectoriesToIgnore.Num() && bShouldRecurse; DirIndex++)
			{
				if (RelativeFilename.StartsWith(DirectoriesToIgnore[DirIndex]))
				{
					bShouldRecurse = false;
				}
			}

			if (bShouldRecurse == true)
			{
				// If it is a directory that we should not recurse (ie we don't want to process subdirectories of it)
				// handle that case as well...
				for (int32 DirIndex = 0; DirIndex < DirectoriesToNotRecurse.Num() && bShouldRecurse; DirIndex++)
				{
					if (RelativeFilename.StartsWith(DirectoriesToNotRecurse[DirIndex]))
					{
						// Are we more than level deep in that directory?
						FString CheckFilename = RelativeFilename.Right(RelativeFilename.Len() - DirectoriesToNotRecurse[DirIndex].Len());
						if (CheckFilename.Len() > 1)
						{
							bShouldRecurse = false;
						}
					}
				}
			}

			// recurse if we should
			if (bShouldRecurse)
			{
				FileInterface.IterateDirectory(FilenameOrDirectory, *this);
			}
		}

		return true;
	}
};

////
FString FPackageDependencyInfo::ScriptSourcePkgName = TEXT("*** SCRIPTSOURCE ***");
FString FPackageDependencyInfo::ShaderSourcePkgName = TEXT("*** SHADERSOURCE ***");

void FPackageDependencyInfo::Initialize(bool bInPreProcessAllFiles)
{
	// Prep everything
	DetermineShaderSourceTimeStamp();
	DetermineScriptSourceTimeStamp();
	PrepContentPackageTimeStamps();

	// If requested, go ahead and determine dependency timestamps for all files
	if (bInPreProcessAllFiles == true)
	{
		DetermineAllDependentTimeStamps();
	}
}

bool FPackageDependencyInfo::DeterminePackageDependentTimeStamp(const TCHAR* InPackageName, FDateTime& OutNewestTime)
{
	bool bSuccessful = true;

	// 
	FPackageDependencyTrackingInfo** pPkgInfo = PackageInformation.Find(InPackageName);
	if ((pPkgInfo == NULL) || (*pPkgInfo == NULL))
	{
		// We don't have this package?
		UE_LOG(LogPackageDependencyInfo, Display, TEXT("\tPackage Info not found for %s!"), InPackageName);
		bSuccessful = false;
	}
	else
	{
		PrepareForNewPackage();

		FPackageDependencyTrackingInfo* PkgInfo = *pPkgInfo;
		bool bHadCircularDependencies = false;
		// Don't process if it was already processed
		if (PkgInfo->DependentTimeStamp == FDateTime::MinValue())
		{
			FDateTime NewestTime = PkgInfo->TimeStamp;
			RecursiveDeterminePackageDependentTimeStamp(InPackageName, NewestTime, bHadCircularDependencies);
			PkgInfo->DependentTimeStamp = NewestTime;
		}
		OutNewestTime = PkgInfo->DependentTimeStamp;

		if (bHadCircularDependencies == true)
		{
			ResolveCircularDependencies(PkgInfo);
		}
	}

	return bSuccessful;
}

void FPackageDependencyInfo::DetermineDependentTimeStamps(const TArray<FString>& InPackageList)
{
	FDateTime TempTimeStamp;
	for (int32 PkgIdx = 0; PkgIdx < InPackageList.Num(); PkgIdx++)
	{
		DeterminePackageDependentTimeStamp(*(InPackageList[PkgIdx]), TempTimeStamp);
	}
}

void FPackageDependencyInfo::DetermineAllDependentTimeStamps()
{
	FDateTime TempTimeStamp;
	for (TMap<FString, FPackageDependencyTrackingInfo*>::TIterator PkgIt(PackageInformation); PkgIt; ++PkgIt)
	{
		FString& PkgName = PkgIt.Key();
		FPackageDependencyTrackingInfo*& PkgInfo = PkgIt.Value();
		if (PkgInfo->DependentTimeStamp == FDateTime::MinValue())
		{
			DeterminePackageDependentTimeStamp(*PkgName, TempTimeStamp);
		}
	}

	// GC to ensure packages aren't hanging around
	CollectGarbage(GARBAGE_COLLECTION_KEEPFLAGS, true);
}

void FPackageDependencyInfo::DetermineShaderSourceTimeStamp()
{
	ShaderSourceTimeStamp = FDateTime::MinValue();

	// Get all the shader source files
	FString ShaderSourceDirectory = FPlatformProcess::ShaderDir();

	// use the timestamp grabbing visitor (include directories)
	TArray<FString> DirectoriesWildcards;
	TArray<FString> DirectoriesToIgnore;
	TArray<FString> DirectoriesToNotRecurse;

	FPackageDependencyTimestampVisitor TimeStampVisitor(FPlatformFileManager::Get().GetPlatformFile(), DirectoriesWildcards, DirectoriesToIgnore, DirectoriesToNotRecurse, false);
	TimeStampVisitor.Visit(*ShaderSourceDirectory, true);
	for (TMap<FString, FDateTime>::TIterator It(TimeStampVisitor.FileTimes); It; ++It)
	{
		FString ShaderFilename = It.Key();
		if (FPaths::GetExtension(ShaderFilename) == TEXT("usf"))
		{
			// It's a shader file
			FDateTime ShaderTimestamp = It.Value();
			if (ShaderTimestamp > ShaderSourceTimeStamp)
			{
				NewestShaderSource = ShaderFilename;
				ShaderSourceTimeStamp = ShaderTimestamp;
			}
		}
	}

	// Add a 'fake' package tracking info for shader source
	ShaderSourcePkgInfo = new FPackageDependencyTrackingInfo(ShaderSourcePkgName, ShaderSourceTimeStamp);
	ShaderSourcePkgInfo->DependentTimeStamp = ShaderSourceTimeStamp;
	PackageInformation.Add(ShaderSourcePkgName, ShaderSourcePkgInfo);
}

/** Determine the newest 'script' time stamp */
void FPackageDependencyInfo::DetermineScriptSourceTimeStamp()
{
	DetermineEngineScriptSourceTimeStamp();
	DetermineGameScriptSourceTimeStamp();

	ScriptSourceTimeStamp = EngineScriptSourceTimeStamp;
	if (ScriptSourceTimeStamp < GameScriptSourceTimeStamp)
	{
		ScriptSourceTimeStamp = GameScriptSourceTimeStamp;
	}

	// Add a 'fake' package tracking info for script source
	ScriptSourcePkgInfo = new FPackageDependencyTrackingInfo(ScriptSourcePkgName, ScriptSourceTimeStamp);
	ScriptSourcePkgInfo->DependentTimeStamp = ScriptSourceTimeStamp;
	PackageInformation.Add(ScriptSourcePkgName, ScriptSourcePkgInfo);
}

void FPackageDependencyInfo::DetermineEngineScriptSourceTimeStamp()
{
	DetermineScriptSourceTimeStamp(true, EngineScriptSourceTimeStamp);
}

void FPackageDependencyInfo::DetermineGameScriptSourceTimeStamp()
{
	DetermineScriptSourceTimeStamp(false, GameScriptSourceTimeStamp);
}

void FPackageDependencyInfo::DetermineScriptSourceTimeStamp(bool bInGame, FDateTime& OutNewestTime)
{
	OutNewestTime = FDateTime::MinValue();

	// @todo uht: This code ignores Plugins and Developer code!
	FString ScriptSourceDirectory = bInGame ? (FPaths::GameDir() / TEXT("Source")) : (FPaths::EngineDir() / TEXT("Source") / TEXT("Runtime"));

	// use the timestamp grabbing visitor (include directories)
	TArray<FString> DirectoriesWildcards;
	DirectoriesWildcards.Add(TEXT("Classes/"));	// @todo uht: Now scanning Public and Private folders, as well as Classes folder
	DirectoriesWildcards.Add(TEXT("Public/"));	
	DirectoriesWildcards.Add(TEXT("Private/"));
	TArray<FString> DirectoriesToIgnore;
	TArray<FString> DirectoriesToNotRecurse;

	FPackageDependencyTimestampVisitor TimeStampVisitor(FPlatformFileManager::Get().GetPlatformFile(), DirectoriesWildcards, DirectoriesToIgnore, DirectoriesToNotRecurse, false);
	TimeStampVisitor.Visit(*ScriptSourceDirectory, true);
	for (TMap<FString, FDateTime>::TIterator It(TimeStampVisitor.FileTimes); It; ++It)
	{
		FString ScriptFilename = It.Key();
		if (FPaths::GetExtension(ScriptFilename) == TEXT("h"))
		{
			// It's a 'script' file
			FDateTime ScriptTimestamp = It.Value();
			if (ScriptTimestamp > OutNewestTime)
			{
				OutNewestTime = ScriptTimestamp;
			}
		}
	}
}

void FPackageDependencyInfo::PrepContentPackageTimeStamps()
{
	TArray<FString> ContentDirectories;
	{
		TArray<FString> RootContentPaths;
		FPackageName::QueryRootContentPaths( RootContentPaths );
		for( TArray<FString>::TConstIterator RootPathIt( RootContentPaths ); RootPathIt; ++RootPathIt )
		{
			const FString& RootPath = *RootPathIt;
			const FString& ContentFolder = FPackageName::LongPackageNameToFilename( RootPath );
			ContentDirectories.Add( ContentFolder );
		}
	}

	// use the timestamp grabbing visitor (include directories)
	TArray<FString> DirectoriesWildcards;
	TArray<FString> DirectoriesToIgnore;
	TArray<FString> DirectoriesToNotRecurse;

	for (int DirIdx = 0; DirIdx < ContentDirectories.Num(); DirIdx++)
	{
		FPackageDependencyTimestampVisitor TimeStampVisitor(FPlatformFileManager::Get().GetPlatformFile(), DirectoriesWildcards, DirectoriesToIgnore, DirectoriesToNotRecurse, false);
		TimeStampVisitor.Visit(*ContentDirectories[DirIdx], true);
		for (TMap<FString, FDateTime>::TIterator It(TimeStampVisitor.FileTimes); It; ++It)
		{
			FString ContentFilename = It.Key();
			if ( FPackageName::IsPackageExtension(*FPaths::GetExtension(ContentFilename, true)) )
			{
				FDateTime ContentTimestamp = It.Value();
				//always use the relative path 
				FString tempContentFileName;
				FPackageName::DoesPackageExist(ContentFilename, NULL, &tempContentFileName);
				ContentFilename = FPaths::GetBaseFilename(tempContentFileName, false);
				// Add it to the pkg info mapping
				FPackageDependencyTrackingInfo* NewInfo = new FPackageDependencyTrackingInfo(ContentFilename, ContentTimestamp);
				PackageInformation.Add(ContentFilename, NewInfo);
			}
		}
	}
}

void FPackageDependencyInfo::RecursiveDeterminePackageDependentTimeStamp(const TCHAR* InPackageName, FDateTime& OutNewestTime, bool& bOutHadCircularReferences)
{
	// Find the package info...
	FPackageDependencyTrackingInfo** pPkgInfo = PackageInformation.Find(InPackageName);
	if ((pPkgInfo != NULL) && (*pPkgInfo != NULL))
	{
		FPackageDependencyTrackingInfo* PkgInfo = *pPkgInfo;
		if (PkgInfo->bBeingProcessed == true)
		{
			// Circular reference??
			bOutHadCircularReferences = true;
			return;
		}

		checkf((PkgInfo->DependentTimeStamp == FDateTime::MinValue()), TEXT("RecursiveDeterminePackageDependentTimeStamp: Package already processed: %s"), InPackageName);

		// We have the package info, so process the actual package.
		BeginLoad();
		ULinkerLoad* Linker = GetPackageLinker(NULL, InPackageName, LOAD_NoVerify, NULL, NULL);
		EndLoad();
		if (Linker != NULL)
		{
			PkgInfo->bBeingProcessed = true;

			// Start off with setting the dependent time to the package itself
			PkgInfo->DependentTimeStamp = PkgInfo->TimeStamp;

			// Map? Code (ie blueprint)?
			PkgInfo->bContainsMap = Linker->ContainsMap();
			PkgInfo->bContainsBlueprints = Linker->ContainsCode();

			FName CheckMaterial = FName(TEXT("Material"));
			FName CheckMIC = FName(TEXT("MaterialInstanceConstant"));
			FName CheckMID = FName(TEXT("MaterialInstanceDynamic"));
			FName CheckLMIC = FName(TEXT("LandscapeMaterialInstanceConstant"));
			FName CheckWorld = FName(TEXT("World"));
			FName CheckBlueprint = FName(TEXT("Blueprint"));
			FName CheckAnimBlueprint = FName(TEXT("AnimBlueprint"));


			// Check the export map for material interfaces
			for (int32 ExpIdx = 0; ExpIdx < Linker->ExportMap.Num(); ExpIdx++)
			{
				FObjectExport& ObjExp = Linker->ExportMap[ExpIdx];
				FName ExpClassName = Linker->GetExportClassName(ExpIdx);
				if ((ExpClassName == CheckMaterial) || 
					(ExpClassName == CheckMIC) || 
					(ExpClassName == CheckMID) || 
					(ExpClassName == CheckLMIC))
				{
					PkgInfo->bContainsShaders = true;
					if (PkgInfo->DependentTimeStamp < ShaderSourceTimeStamp)
					{
						PkgInfo->DependentTimeStamp = ShaderSourceTimeStamp;
					}
					PkgInfo->DependentPackages.Add(ShaderSourcePkgName, ShaderSourcePkgInfo);
					AllPackages.Add(ShaderSourcePkgInfo);
				}
				else if (ExpClassName == CheckWorld)
				{
					PkgInfo->bContainsMap = true;
				}
				else if ((ExpClassName == CheckBlueprint) ||
					(ExpClassName == CheckAnimBlueprint))
				{
					PkgInfo->bContainsBlueprints = true;
					if (PkgInfo->DependentTimeStamp < ScriptSourceTimeStamp)
					{
						PkgInfo->DependentTimeStamp = ScriptSourceTimeStamp;
					}
					PkgInfo->DependentPackages.Add(ScriptSourcePkgName, ScriptSourcePkgInfo);
					AllPackages.Add(ScriptSourcePkgInfo);
				}
			}

			// Check the dependencies
			//@todo. Make this a function of the linker? Almost the exact same code is used in PkgInfo commandlet...
			FName LinkerName = Linker->LinkerRoot->GetFName();
			TArray<FName> DependentPackages;
			for (int32 ImpIdx = 0; ImpIdx < Linker->ImportMap.Num(); ImpIdx++)
			{
				FObjectImport& ObjImp = Linker->ImportMap[ImpIdx];

				FName PackageName = NAME_None;
				FName OuterName = NAME_None;
				if (!ObjImp.OuterIndex.IsNull())
				{
					// Find the package which contains this import.  import.SourceLinker is cleared in EndLoad, so we'll need to do this manually now.
					FPackageIndex OutermostLinkerIndex = ObjImp.OuterIndex;
					for (FPackageIndex LinkerIndex = ObjImp.OuterIndex; !LinkerIndex.IsNull();)
					{
						OutermostLinkerIndex = LinkerIndex;
						LinkerIndex = Linker->ImpExp(LinkerIndex).OuterIndex;
					}
					PackageName = Linker->ImpExp(OutermostLinkerIndex).ObjectName;
				}

				if (PackageName == NAME_None && ObjImp.ClassName == NAME_Package)
				{
					PackageName = ObjImp.ObjectName;
				}

				if ((PackageName != NAME_None) && (PackageName != LinkerName))
				{
					DependentPackages.AddUnique(PackageName);
				}

				if ((ObjImp.ClassPackage != NAME_None) && (ObjImp.ClassPackage != LinkerName))
				{
					DependentPackages.AddUnique(ObjImp.ClassPackage);
				}
			}

			for (int32 DependentIdx = 0; DependentIdx < DependentPackages.Num(); DependentIdx++)
			{
				FString PkgName = DependentPackages[DependentIdx].ToString();
				FText Reason;
				if (!FPackageName::IsValidLongPackageName(PkgName, true, &Reason))
				{
					//UE_LOG(LogPackageDependencyInfo, Display, TEXT("%s --> %s"), *PkgName, *Reason.ToString());
					continue;
				}
				FString LongName = FPackageName::LongPackageNameToFilename(PkgName);
				//UE_LOG(LogPackageDependencyInfo, Display, TEXT("%s --> %s"), *PkgName, *LongName);
				// Is it already in the list
				FPackageDependencyTrackingInfo** pDepPkgInfo = PackageInformation.Find(LongName);
				if ((pDepPkgInfo == NULL) || (*pDepPkgInfo == NULL))
				{
					continue;
				}

				FPackageDependencyTrackingInfo* DepPkgInfo = *pDepPkgInfo;
				if (DepPkgInfo->bBeingProcessed == true)
				{
					bOutHadCircularReferences = true;
					// Circular reference
					// For now, store it off and we will resolve when completed
					PkgInfo->DependentPackages.Add(LongName, DepPkgInfo);
					PkgInfo->bHasCircularReferences = true;
					AllPackages.Add(PkgInfo);
					continue;
				}

				if (DepPkgInfo->DependentTimeStamp == FDateTime::MinValue())
				{
					FDateTime TempTime;
					RecursiveDeterminePackageDependentTimeStamp(*LongName, TempTime, bOutHadCircularReferences);
				}
			
				PkgInfo->DependentPackages.Add(LongName, DepPkgInfo);
				AllPackages.Add(DepPkgInfo);

				if (DepPkgInfo->DependentTimeStamp != FDateTime::MinValue())
				{
					if (PkgInfo->DependentTimeStamp < DepPkgInfo->DependentTimeStamp)
					{
						PkgInfo->DependentTimeStamp = DepPkgInfo->DependentTimeStamp;
					}
				}
			}

			PkgInfo->bBeingProcessed = false;
			OutNewestTime = PkgInfo->DependentTimeStamp;
		}
		else
		{
			UE_LOG(LogPackageDependencyInfo, Display, TEXT("RecursiveDeterminePackageDependentTimeStamp: Failed to find linker for %s"), InPackageName);
		}
	}
	else
	{
		UE_LOG(LogPackageDependencyInfo, Display, TEXT("RecursiveDeterminePackageDependentTimeStamp: Failed to find package info for %s"), InPackageName);
	}
}

void FPackageDependencyInfo::ResolveCircularDependencies(FPackageDependencyTrackingInfo* InPkgInfo)
{
	double Seconds = 0.0f;
	{
		SCOPE_SECONDS_COUNTER(Seconds);

		NumResolvePasses = 0;
		NumResolveIterations = 0;
		NumCirculars = 0;

		ResolveCircularDependenciesInnerFast();
	}

	UE_LOG(LogPackageDependencyInfo, Verbose, TEXT("Resolve circular dependencies for package %s took %.1f ms (Iter=%i, Passes=%i, Circulars=%i)"), 
		*InPkgInfo->PackageName, 
		Seconds*1000.0f, 
		NumResolveIterations, 
		NumResolvePasses, 
		NumCirculars );
}

void FPackageDependencyInfo::ResolveCircularDependenciesInnerFast()
{
	int32 NumReResolves = 0;

	// We have a list of all packages the current package depends on.
	// And we iterate through the list as long as we won't update any package info.
	TSet<FPackageDependencyTrackingInfo*> ToBeProcessed;

	// Find packages that matters.
	for( auto ResolveIt = AllPackages.CreateIterator(); ResolveIt; ++ResolveIt )
	{
		FPackageDependencyTrackingInfo* PkgInfo = *ResolveIt;
		if( PkgInfo && PkgInfo->DependentPackages.Num() )
		{
			ToBeProcessed.Add( PkgInfo );
		}
	}

	do 
	{
		NumReResolves = 0;
		// Iterate through all valid packages.
		for( auto ResolveIt = ToBeProcessed.CreateIterator(); ResolveIt; ++ResolveIt )
		{
			const int32 PackageIndex = 0;
			FPackageDependencyTrackingInfo* InPkgInfo = *ResolveIt;

			// Iterate through all dependent packages and update time if necessary.
			for( auto DepPkgIt = InPkgInfo->DependentPackages.CreateIterator(); DepPkgIt; ++DepPkgIt )
			{
				NumResolveIterations++;
				FPackageDependencyTrackingInfo* DepPkgInfo = DepPkgIt.Value();
				if( DepPkgInfo != NULL )
				{			
					if( InPkgInfo->DependentTimeStamp < DepPkgInfo->DependentTimeStamp )
					{
						InPkgInfo->DependentTimeStamp = DepPkgInfo->DependentTimeStamp;
						ResolvedCircularDependencies.Add(InPkgInfo);
						NumCirculars++;

						// We updated a timestamp, so we need to run the iteration once again to make sure that other packages will be updated as well.
						NumReResolves++;
					}
				}
			}
		}

		NumResolvePasses++;
	} 
	while( NumReResolves > 0 );
}

void FPackageDependencyInfo::PrepareForNewPackage()
{
	AllPackages.Empty();
	ResolvedCircularDependencies.Empty();

	NumResolvePasses = 0;
	NumResolveIterations = 0;
	NumCirculars = 0;
}

////
FPackageDependencyInfo* FPackageDependencyInfoModule::PackageDependencyInfo = NULL;

void FPackageDependencyInfoModule::StartupModule()
{
	PackageDependencyInfo = new FPackageDependencyInfo();
	checkf(PackageDependencyInfo, TEXT("PackageDependencyInfo module failed to create instance!"));
	PackageDependencyInfo->Initialize(false);
}

void FPackageDependencyInfoModule::ShutdownModule()
{
	delete PackageDependencyInfo;
	PackageDependencyInfo = NULL;
}

bool FPackageDependencyInfoModule::DeterminePackageDependentTimeStamp(const TCHAR* InPackageName, FDateTime& OutNewestTime)
{
	check(PackageDependencyInfo);
	return PackageDependencyInfo->DeterminePackageDependentTimeStamp(InPackageName, OutNewestTime);
}

void FPackageDependencyInfoModule::DetermineDependentTimeStamps(const TArray<FString>& InPackageList)
{
	check(PackageDependencyInfo);
	return PackageDependencyInfo->DetermineDependentTimeStamps(InPackageList);
}

void FPackageDependencyInfoModule::DetermineAllDependentTimeStamps()
{
	check(PackageDependencyInfo);
	return PackageDependencyInfo->DetermineAllDependentTimeStamps();
}

void FPackageDependencyInfoModule::GetAllPackageDependentInfo(TMap<FString, FPackageDependencyTrackingInfo*>& OutPkgDependencyInfo)
{
	check(PackageDependencyInfo);
	OutPkgDependencyInfo = PackageDependencyInfo->PackageInformation;
}
