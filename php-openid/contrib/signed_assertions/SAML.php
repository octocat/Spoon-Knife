<?php
/**
 ** PHP versions 4 and 5
 **
 ** LICENSE: See the COPYING file included in this distribution.
 **
 ** @package OpenID
 ** @author Santosh Subramanian <subrasan@cs.sunysb.edu>
 ** @author Shishir Randive <srandive@cs.sunysb.edu>
 ** Stony Brook University.
 ** largely derived from 
 **
 * Copyright (C) 2007 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

class SAML{
   private $assertionTemplate=null;
   /**
    * Returns a SAML response with various elements filled in.
    * @param string $authenticatedUser The OpenId of the user 
    * @param string $notBefore The ISO 8601 formatted date before which the 
    response is invalid
    * @param string $notOnOrAfter The ISO 8601 formatted data after which the 
    response is invalid
    * @param string $rsadsa 'rsa' if the response will be signed with RSA keys, 
    'dsa' for DSA keys
    * @param string $requestID The ID of the request we're responding to
    * @param string $destination The ACS URL that the response is submitted to
    * @return string XML SAML response.
    */
   function createSamlAssertion($authenticatedUser, $notBefore, $notOnOrAfter, $rsadsa, $acsURI,$attribute,$value,$assertionTemplate)
   {
      $samlResponse = $assertionTemplate;
      $samlResponse = str_replace('USERNAME_STRING', $authenticatedUser, $samlResponse); 
      $samlResponse = str_replace('RESPONSE_ID', $this->samlCreateId(), $samlResponse);
      $samlResponse = str_replace('ISSUE_INSTANT', $this->samlGetDateTime(time()), $samlResponse);
      $samlResponse = str_replace('NOT_BEFORE', $this->samlGetDateTime(strtotime($notBefore)), $samlResponse);
      $samlResponse = str_replace('NOT_ON_OR_AFTER', $this->samlGetDateTime(strtotime($notOnOrAfter)),$samlResponse);
      $samlResponse = str_replace('ASSERTION_ID',$this->samlCreateId(), $samlResponse);
      $samlResponse = str_replace('RSADSA', strtolower($rsadsa), $samlResponse);
      $samlResponse = str_replace('ISSUER_DOMAIN', $acsURI, $samlResponse);
      $samlResponse = str_replace('ATTRIBUTE_NAME', $attribute, $samlResponse);
      $samlResponse = str_replace('ATTRIBUTE_VALUE', $value, $samlResponse);
      return $samlResponse;
   }

   /**
    * Signs a SAML response with the given private key, and embeds the public key.
    * @param string $responseXmlString The unsigned Assertion which will be signed 
    * @param string $priKey Private key to sign the certificate 
    * @param string $cert Public key certificate of signee
    * @return string Signed Assertion 
    */
   function signAssertion($responseXmlString,$privKey,$cert) 
   {
      if (file_exists("/tmp/xml")) {
         $tempFileDir="/tmp/xml/";          
      
      } else {
             mkdir("/tmp/xml",0777);   
         $tempFileDir="/tmp/xml/";
      }
      $tempName = 'saml-response-' . $this->samlCreateId() . '.xml';
      $tempFileName=$tempFileDir.$tempName;
      while (file_exists($tempFileName)) 
         $tempFileName = 'saml-response-' . $this->samlCreateId() . '.xml';

      if (!$handle = fopen($tempFileName, 'w')) {
         return null;
      }
      if (fwrite($handle, $responseXmlString) === false) {
         return null;
      }
      fclose($handle);
      $cmd = 'xmlsec1 --sign --privkey-pem ' . $privKey . 
         ',' . $cert . ' --output ' . $tempFileName . 
         '.out ' . $tempFileName;
      exec($cmd, $resp);
      unlink($tempFileName);

      $xmlResult = @file_get_contents($tempFileName . '.out');
      if (!$xmlResult) { 
         return null;
      } else {
         unlink($tempFileName . '.out');
         return $xmlResult;
      }
   }


   /**
    * Verify a saml response with the given public key.
    * @param string $responseXmlString Response to sign
    * @param string $rootcert trusted public key certificate
    * @return string Signed SAML response
    */
   function verifyAssertion($responseXmlString,$rootcert) 
   {
      date_default_timezone_set("UTC");
      if (file_exists("/tmp/xml")) {
         $tempFileDir="/tmp/xml/";          
      
      } else {
             mkdir("/tmp/xml",0777);   
         $tempFileDir="/tmp/xml/";
      }
      
      $tempName = 'saml-response-' . $this->samlCreateId() . '.xml';
      $tempFileName=$tempFileDir.$tempName;
      while (file_exists($tempFileName)) 
         $tempFileName = 'saml-response-' . $this->samlCreateId() . '.xml';

      if (!$handle = fopen($tempFileName, 'w')) {
         return false;
      }

      if (fwrite($handle, $responseXmlString) === false) {
         return false;
      }

      $p=xml_parser_create();
      $result=xml_parse_into_struct($p,$responseXmlString,$vals,$index);
      xml_parser_free($p);
      $cert_info=$index["X509CERTIFICATE"];
      $conditions=$index["CONDITIONS"];
      foreach($cert_info as $key=>$value){
         file_put_contents($tempFileName.'.cert',$vals[$value]['value']);
      }
      $cert=$tempFileName.'.cert';
      $before=0;
      $after=0;
      foreach($conditions as $key=>$value){
         $before=$vals[$value]['attributes']['NOTBEFORE'];
         $after=$vals[$value]['attributes']['NOTONORAFTER'];
      }
      $before=$this->validSamlDateFormat($before);
      $after=$this->validSamlDateFormat($after);
      if(strtotime("now") < $before || strtotime("now") >= $after){
         unlink($tempFileName);
         unlink($cert);
         return false;
      }
      fclose($handle);
      $cmd = 'xmlsec1 --verify --pubkey-cert ' . $cert .'--trusted '.$rootcert. ' '.$tempFileName.'* 2>&1 1>/dev/null';
      exec($cmd,$resp);
      if(strcmp($resp[0],"FAIL") == 0){
         $value = false;
      }elseif(strcmp($resp[0],"ERROR") == 0){
         $value = false;
      }elseif(strcmp($resp[0],"OK") == 0){
         $value = TRUE;
      }
      unlink($tempFileName);
      unlink($cert);
      return $value;
   }

   /**
    * Creates a 40-character string containing 160-bits of pseudorandomness.
    * @return string Containing pseudorandomness of 160 bits
    */

   function samlCreateId() 
   {
      $rndChars = 'abcdefghijklmnop';
      $rndId = '';
      for ($i = 0; $i < 40; $i++ ) {
         $rndId .= $rndChars[rand(0,strlen($rndChars)-1)];
      }
      return $rndId;
   }

   /**
    * Returns a unix timestamp in xsd:dateTime format.
    * @param timestamp int UNIX Timestamp to convert to xsd:dateTime 
    * ISO 8601 format.
    * @return string
    */
   function samlGetDateTime($timestamp) 
   {
      return gmdate('Y-m-d\TH:i:s\Z', $timestamp);
   }
   /**
    * Attempts to check whether a SAML date is valid.  Returns true or false.
    * @param string $samlDate
    * @return bool
    */

   function validSamlDateFormat($samlDate) 
   {
      if ($samlDate == "") return false;
      $indexT = strpos($samlDate, 'T');
      $indexZ = strpos($samlDate, 'Z');
      if (($indexT != 10) || ($indexZ != 19)) {
         return false;
      }
      $dateString = substr($samlDate, 0, 10);
      $timeString = substr($samlDate, $indexT + 1, 8);
      list($year, $month, $day) = explode('-', $dateString);
      list($hour, $minute, $second) = explode(':', $timeString);
      $parsedDate = gmmktime($hour, $minute, $second, $month, $day, $year);
      if (($parsedDate === false) || ($parsedDate == -1)) return false;
      if (!checkdate($month, $day, $year)) return false;
      return $parsedDate;
   }

}
?>
