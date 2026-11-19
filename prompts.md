# Prompts used (AI-assisted)

AI tool: Claude Code

## 2026-11-18

I need you to create project with React & Next.js, and on main page need to create 6 section for function and always I prompted I need you to log all of this prompt to file prompts.md

---

## 2026-11-18

on file prompts.md I need to add
Prompts used (AI-assisted)
AI tool: Claude Code
for head of file
and first function I need to do is " Write a function that takes a string containing only the characters `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'`, and determines if the input string has valid, properly matched and nested brackets. Return `true` if valid, and `false` otherwise.
Examples:

* `"()"` > `true`
* `"([{}])"` > `true`
* `"([)]"` > `false`
* `"{"` > `false`"

And when you're done creating every function, I need you to test how each function works

---

## 2026-11-18 23:13:38

I think I need to playwright for unit test, please change it

---

## 2026-11-18 23:32:16

ok, next function need to do is

---

## 2026-11-18 23:32:43

ok, next function need to do is
Write a function that takes an array of strings and returns the array sorted using natural sort order (alphabetical order for text prefixes, and numerical value order for embedded numbers).
Examples:

* `["TH19", "SG20", "TH2"]` > `["SG20", "TH2", "TH19"]`
* `["TH10", "TH3Netflix", "TH1", "TH7"]` > `["TH1", "TH3Netflix", "TH7", "TH10"]`

---

## 2026-11-19 10:37:42

ok, next function is 
Write an `autocomplete(search, items, maxResult)` function that performs a case-insensitive search for `search` within `items`, returning up to `maxResult` matches sorted by match position:

1. Starts with `search`
2. Contains `search` in the middle
3. Ends with `search`

Example:

* `autocomplete("th", ["Mother", "Think", "Worthy", "Apple", "Android"], 2)` >`["Think", "Mother"]`

---

## 2026-11-19 12:36:59

I need you to fix max result by set limit with array count

---

## 2026-11-19 14:01:04

Ok, next function I need is
Write two functions to convert between integers and Modern Roman Numerals (I=1, V=5, X=10, L=50, C=100, D=500, M=1000) using standard subtractive notation (e.g., IV=4, IX=9, CM=900):

1. intToRoman(num): Takes an integer and returns its Roman numeral string representation.
2. romanToInt(roman): Takes a Roman numeral string and returns its integer value.

Examples:
1989 <-> "MCMLXXXIX"
2000 <-> "MM"
68 <-> "LXVIII"
109 <-> "CIX"
and I want table for symbol
symbol.  value
I     1
V   5
X   10
L  50
C  100
D   500
M 1,000

---

## 2026-11-19 14:49:31

I need to hide Roman symbols table and make it can you do like caution symbol like this image?

---

## 2026-11-19 14:52:41

move Icon to top right of section

---

## 2026-11-19 14:55:54

change action for button icon from click to show to hover to show, but on mobile mode click icon to show table

---

## 2026-11-19 15:00:24

ok, next function is
Write a function that takes a positive integer, sorts its digits in descending order, and returns the resulting integer.
Examples:

* `3008` > `8300`
* `1989` > `9981`
* `2679` > `9762`
* `9163` > `9631`

---

## 2026-11-19 15:09:18

ok, last function is
Write a function `tribonacci(signature, n)` that generates the first `n` elements of a Tribonacci sequence (where each subsequent number is the sum of the previous three).

* `signature`: An array of 0 to 3 initial integers.
* `n`: A non-negative integer specifying the total number of elements to return (including the initial signature).

Examples:

* `f([1, 3, 5], 5)` > `[1, 3, 5, 9, 17]`
* `f([2, 2, 2], 3)` > `[2, 2, 2]`
* `f([10, 10, 10], 4)` > `[10, 10, 10, 30]`

---

## 2026-11-19 15:30:35

ok, It's almost done I need animation when click name of function menu need animation auto scroll to those section.

---

## 2026-11-19 15:34:21

I'll restart it

---

## 2026-11-19 23:51:30

can you clone this project to this folder /git/persec2026-Web-dev-interview-natitorn-phongphanpunya

---

