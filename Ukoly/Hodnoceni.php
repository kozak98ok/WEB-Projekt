<?php


echo "<h1>hodnoceni testu</h1>";
$studentname = "Jan Novák";
echo "$studentname";
$test1 = 100;
$test2 = 100;
$test3 = 100;

echo "<h2>Celkovy pocet bodu</h2>";

$celkovypocetbodu = $test1 + $test2 + $test3;
if ($celkovypocetbodu > 300 || $celkovypocetbodu < 0) {
    echo "Neni mozny<br>";
}else
echo "$celkovypocetbodu<br>";


echo "<h2>prumer body</h2>";

if ($test1 < 0 || $test2 < 0 || $test3 < 0 || $test1 > 100 || $test2 > 100 || $test3 > 100) {
    echo "Neni mozny<br>";
}else
$prumerbodu = $celkovypocetbodu/3;
if ($prumerbodu > 100 || $prumerbodu < 0) {
    echo "Neni mozny<br>";
}else
echo "$prumerbodu<br>";

echo "<h2>Procenta testu</h2>";

if ($test1 > 100 || $test1 < 0){
    echo "Neni mozny<br>";
}else
    echo "Prvni test: $test1%<br>";


if ($test2 > 100 || $test2 < 0){
    echo "<br>Neni mozny<br>";
}else
    echo "<br>Druhy test: $test2%<br>";


if ($test3 > 100 || $test3 < 0){
    echo "<br>Neni mozny<br>";
}else
    echo "<br>Treti test: $test3%<br>";


echo "<h2>Znamka testu</h2>";

echo "<h3>Znamka 1 testu</h3>";
if ($test1 > 100 || $test1 < 0) {
    echo "Neni mozny";
}elseif ($test1 >= 90) {
    echo "Za 1";
}elseif ($test1 <= 89 && $test1 >= 75) {
    echo "Za 2";
}elseif ($test1 <= 74 && $test1 >= 60) {
    echo "Za 3";
}elseif ($test1 <= 59 && $test1 >= 40) {
    echo "Za 4";
}elseif ($test1 <= 39) {
    echo "Za 5";
}

echo "<h3>Znamka 2 testu</h3>";
if ($test2 > 100 || $test2 < 0) {
    echo "Neni mozny";
}elseif ($test2 >= 90) {
    echo "Za 1";
}elseif ($test2 <= 89 && $test2 >= 75) {
    echo "Za 2";
}elseif ($test2 <= 74 && $test2 >= 60) {
    echo "Za 3";
}elseif ($test2 <= 59 && $test2 >= 40) {
    echo "Za 4";
}elseif ($test2 <= 39) {
    echo "Za 5";
}

echo "<h3>Znamka 3 testu</h3>";
if ($test3 > 100 || $test3 < 0) {
    echo "Neni mozny";
}elseif ($test3 >= 90) {
    echo "Za 1";
}elseif ($test3 <= 89 && $test3 >= 75) {
    echo "Za 2";
}elseif ($test3 <= 74 && $test3 >= 60) {
    echo "Za 3";
}elseif ($test3 <= 59 && $test3 >= 40) {
    echo "Za 4";
}elseif ($test3 <= 39) {
    echo "Za 5";
}

