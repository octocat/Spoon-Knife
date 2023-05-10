# Anypass SDK

「Anypass SDK」は、電話番号とSMSの認証、電話番号の変更機能を備えたアプリを簡単に作成できるようにするSDKです。 これらの機能を使用するための低レベル APIを提供しています。

目次
=================

<!--ts-->
   * [機能](#機能)
	   * [Androidの機能](#androidの機能)
	   * [IOSの機能](#iosの機能)
	   * [一般的な機能](#一般的な機能)
   * [リリース](#リリース)
   * [インストール](#インストール)
      * [要件](#要件)
      * [構成](#構成)
	      * [Android構成](#android構成)
	      * [IOS構成](#ios構成)
   * [入門](#入門)
	   * [パブリックAPI](#パブリックapi)
		   * [Android Kotlin](#android-kotlin)
		   * [IOS Swift](#ios-swift)
   * [参考例](#参考例)
<!--te-->

## 機能

### Androidの機能
**電話番号認証**: ユーザーが許可した場合、デバイスの電話番号を自動的に取得し、この電話番号を認証して結果を返します。

### IOSの機能
**SMS認証**: SMSを送信することで電話番号を認証します。

### 一般的な機能
**引継ぎ(電話番号変更なし)**: 電話番号を変更せずにアカウントを移行します。

**引継ぎ(電話番号変更あり)**: アカウントを移行して電話番号を変更します。

## リリース
* [変更ログ](CHANGELOG.md) では、各リリースの変更概要について説明します。
* [移行ガイド](MIGRATING.md) では、旧バージョンからのアップグレードを行う手順について説明します。

## インストール

### 要件
#### Android
* Android 6.0 (API レベル 23) 以降

#### IOS
* IOS 11 以降
* Swift 5.0 以降又は Objective C

### 構成
#### Android構成
anypass_sdk.jar を案件にインポートします。

- 例: (app-debug.aar)
1. ファイルを app/libsフォルダー に追加します。
![Import Module](images/5.png)
2. アプリの [build.gradle](https://developer.android.com/studio/build/dependencies#using-native-dependencies)ファイルに依存関係を追加します。
![Import Module](images/6.png)
 
#### IOS構成
作成した xcframework ファイルを Frameworks、ライブラリ、および埋め込みコンテンツでドラッグ＆ドロップ操作で追加します。
![Import Module](images/8.png)


## 入門

### パブリックAPI

> #### Android Kotlin

| 関数 |説明<div style="width:2990px">property</div>|  入力  |
|--|--|--|
| verifyAndroidPhoneNumber | 電話番号を認証します。| Domain, DomainApiVerifyPhone |
| transferAccountWithoutChangePhoneNumber | 電話番号を変更せずにアカウントを移行します。 |Domain, DomainApiVerifyPhone|
| transferAccountWithChangePhoneNumber | 電話番号を変更してアカウントを移行します。 |Domain, DomainApiVerifyPhone|


1.  SDKの起動用ランチャーを作成します。

```kotlin
private val launcher = AnyPassSDK.createResultLauncher(this)

```

2.  SDK ビルダーを作成し、SDK を起動します。

```kotlin
AnyPassSDKBuilder(this) // Set your callback listener here
                      .setDomain("YOUR_WEB_DOMAIN") // Set your domain here
                      .setApiVerifyPhone("YOUR_API_DOMAIN") // Set your ApiVerifyPhone here
                      .start(launcher, this) // start with launcher and activity

```

3. WebView URLを読み込みます。

-   Android の電話番号を確認します。

```kotlin
AnyPassSDK.verifyAndroidPhoneNumber()

```

-   電話番号を変更せずにアカウントを移行します。

```kotlin
AnyPassSDK.transferAccountWithoutChangePhoneNumber()

```

-   電話番号を変更してアカウントを移行します。

```kotlin
AnyPassSDK.transferAccountWithChangePhoneNumber()

```

4.  コールバック リスナー

```java
class MainActivity : AppCompatActivity(), ClientEventListener {

		override fun didAuthFail(sdkCode: String, msg: String) {

		}

		override fun didAuthSuccess(sdkCode: String?, msg: String?) {

		}
}

```

 <br /> <br />

> #### IOS Swift
| 関数 | 説明 |  入力  |
|--|--|--|
| verifyIosSms | SMSを送信することで電話番号を認証します。 | domainURL |
| transferAccountWithoutChangePhoneNumber | 電話番号を変更せずにアカウントを移行します。 |domainURL|
| transferAccountWithChangePhoneNumber | アカウントを移行して電話番号を変更します。 |domainURL|

1.  SDK の初期化

```swift
let config = AnyPassConfig(viewController: self, domainURL: "YOUR_WEB_DOMAIN")
let authentication = AnyPassAuthentication(with: config)
authentication.delegate = self

```

2.  機能

-   SMS を認証します。

```swift
authentication.verifyIosSms()

```

-   電話番号を変更せずにアカウントを移行します。

```swift
authentication.transferAccountWithoutChangePhoneNumber()

```

-   電話番号を変更してアカウントを移行します。

```swift
authentication.transferAccountWithChangePhoneNumber()

```

3.  デリゲート

```swift
extension ViewController: AnyPassAuthDelegate {
    func didAuthSuccess(userInfo: AnyPassResult) {
        
    }
    
    func didAuthFailure(error: AnyPassResult) {
        
    }
}

```

<br/><br/>

#### `statusCodes`

発生する可能性があるエラーは下記の通りです。説明内容を参考に、どのエラーが発生したか判断できます。

| 名前                          | 説明                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NG_ERROR`           | API 関連のエラー                                                                                                                                                                                                                                                                                                                                     |
| `OK_USER_REGISTRATION`                 | 発券用情報の登録が完了しました。|
| `OK_USER_TRANSITION`            | 発券用情報の引継ぎが完了しました。                                                                                                                                                                                                                                                                                                        |
| `NG_NOTHING_TRANSFERER` | 引継ぎ元の登録情報がありません。                                                                                                                                                                                                                                                                                         |
| `NG_SYSTEM_ERROR` | システムエラーが発生しました。                                                                                                                                                                                                                                                                                         |

### 参考例
-  [Kotlin サンプル プロジェクト](example/kotlin) 
-  [Swift サンプル プロジェクト](example/swift) 

## ライセンス

(確認待ち)
