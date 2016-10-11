撒地方是大哥


<?php
class BaseClass {
   function __construct() {
   	$this->name = 'jfask';
       print "In BaseClass constructor<br>";

   }
}
 
class SubClass extends BaseClass {
   function __construct() {
       parent::__construct();
       print "In SubClass constructor\n<br>";
   }
}
 
class OtherSubClass extends BaseClass {
    // inherits BaseClass's constructor
}
 
// In BaseClass constructor
$obj = new BaseClass();
echo $obj->name;
 
// In BaseClass constructor
// In SubClass constructor
$obj = new SubClass();
 
// In BaseClass constructor
$obj = new OtherSubClass();


class ordinary{
	function t(){
		echo 'tes'."<br>";
	}
}
$foo = new ordinary();
$foo->t();

class st{
	static function s(){
		echo 's';
	}
	function r(){
		self::s();
	}
	
}
st::s();
$f = new st();
$f->r();

echo "<hr>";

class Person{
    // public $name;
    // public $age;
    // public $gender;

    public function __construct($name,$age,$gender){
        $this->name = $name;
        $this->age = $age;
        $this->gender = $gender;
        $this->m = 'sdf';
    }

    public function setName($name){
        $this->name = $name;
    }

    // ... getter setter 方法

}

$peron = new Person("lee",18,'男');
echo $peron->name,$peron->age;

