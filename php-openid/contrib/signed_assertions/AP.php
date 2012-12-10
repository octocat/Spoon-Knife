<?php

/**
 * Introduces the notion of an Attribute Provider that attests and signs
 * attributes
 * Uses OpenID Signed Assertions(Sxip draft) for attesting attributes
 * PHP versions 4 and 5
 *
 * LICENSE: See the COPYING file included in this distribution.
 *
 * @package OpenID
 * @author Santosh Subramanian <subrasan@cs.sunysb.edu>
 * @author Shishir Randive <srandive@cs.sunysb.edu>
 * Stony Brook University.
 *
 */
require_once 'Auth/OpenID/SAML.php';
/**
 * The Attribute_Provider class which signs the attribute,value pair 
 * for a given openid.
 */
class Attribute_Provider
{
   private $public_key_certificate=null;
   private $private_key=null;
   private $authenticatedUser=null;
   private $notBefore=null;
   private $notOnOrAfter=null;
   private $rsadsa=null;
   private $acsURI=null;
   private $attribute=null;
   private $value=null;
   private $assertionTemplate=null;
   /**
    * Creates an Attribute_Provider object initialized with startup values.
    * @param string $public_key_certificate - The public key certificate 
	of the signer.
    * @param string $private_key - The private key of the signer.
    * @param string $notBefore - Certificate validity time 
    * @param string $notOnOrAfter - Certificate validity time
    * @param string $rsadsa - Choice of the algorithm (RSA/DSA)
    * @param string $acsURI - URI of the signer.
    * @param string $assertionTemplate - SAML template used for assertion
    */
   function Attribute_Provider($public_key_certificate,$private_key,$notBefore,$notOnOrAfter,$rsadsa,$acsURI,
                               $assertionTemplate)
   {
      $this->public_key_certificate=$public_key_certificate;
           $this->private_key=$private_key;
      $this->notBefore=$notBefore;
      $this->notOnOrAfter=$notOnOrAfter;
      $this->rsadsa=$rsadsa;
      $this->acsURI=$acsURI;
      $this->assertionTemplate=$assertionTemplate;
   }
   /**
    * Create the signed assertion.
    * @param string $openid - Openid of the entity being asserted.
    * @param string $attribute - The attribute name being asserted.
    * @param string $value - The attribute value being asserted.
    */
   function sign($openid,$attribute,$value)
   {
      $samlObj = new SAML();
      $responseXmlString = $samlObj->createSamlAssertion($openid, 
                                                         $this->notBefore, 
                                                         $this->notOnOrAfter, 
                                                         $this->rsadsa,
                                                         $this->acsURI,
                                                         $attribute,
                                                         sha1($value),
                                                      $this->assertionTemplate);
      $signedAssertion=$samlObj->signAssertion($responseXmlString,
                                               $this->private_key,
                                               $this->public_key_certificate);
      return $signedAssertion;
   }
}
/**
 * The Attribute_Verifier class which verifies the signed assertion at the Relying party.
 */
class Attribute_Verifier
{
   /**
    * The certificate the Relying party trusts.
   */
   private $rootcert;
   /**
    * This function loads the public key certificate that the relying party trusts.
    * @param string $cert - Trusted public key certificate.
    */
   function load_trusted_root_cert($cert)
   {
      $this->rootcert=$cert;
   }
   /**
    * Verifies the certificate given the SAML document.
    * @param string - signed SAML assertion
    * return @boolean - true if verification is successful, false if unsuccessful.
   */
   function verify($responseXmlString)
   {
      $samlObj = new SAML();
      $ret = $samlObj->verifyAssertion($responseXmlString,$this->rootcert);
      return $ret;
   }
}

/**
 * This is a Store Request creating class at the Attribute Provider.
 */
class AP_OP_StoreRequest
{
   /**
    * Creates store request and adds it as an extension to AuthRequest object 
      passed to it.
    * @param &Auth_OpenID_AuthRequest &$auth_request - A reference to 
      the AuthRequest object.
    * @param &Attribute_Provider &$attributeProvider - A reference to the  
      Attribute Provider object.
    * @param string $attribute - The attribute name being asserted.
    * @param string $value - The attribute value being asserted.
    * @param string $openid - Openid of the entity being asserted.
    * @return &Auth_OpenID_AuthRequest - Auth_OpenID_AuthRequest object 
                                   returned with StoreRequest extension.
   */
   static function createStoreRequest(&$auth_request,&$attributeProvider,
                                               $attribute,$value,$openid)
   {
      if(!$auth_request){
         return null;
      }
      $signedAssertion=$attributeProvider->sign($openid,$attribute,$value);
      $store_request=new Auth_OpenID_AX_StoreRequest;
      $store_request->addValue($attribute,base64_encode($value));
      $store_request->addValue($attribute.'/signature',
                                           base64_encode($signedAssertion));
      if($store_request) {
         $auth_request->addExtension($store_request);
         return $auth_request;
      }
   }
}

/*
 *This is implemented at the RP Takes care of getting the attribute from the 
 *AX_Fetch_Response object and verifying it.
 */
class RP_OP_Verify
{
   /**
    * Verifies a given signed assertion.
    * @param &Attribute_Verifier &$attributeVerifier - An instance of the class 
                                            passed for the verification.
    * @param Auth_OpenID_Response - Response object for extraction.
    * @return boolean - true if successful, false if verification fails.
    */
   function verifyAssertion(&$attributeVerifier,$response)
   {
      $ax_resp=Auth_OpenID_AX_FetchResponse::fromSuccessResponse($response);
      if($ax_resp instanceof Auth_OpenID_AX_FetchResponse){
         $ax_args=$ax_resp->getExtensionArgs();
         if($ax_args) {
            $value=base64_decode($ax_args['value.ext1.1']);
            if($attributeVerifier->verify($value)){
               return base64_decode($ax_args['value.ext0.1']);
            } else {
               return null;
            }
         } else {
            return null;
         }
      } else {
         return null;
      }
   }
}


?>
