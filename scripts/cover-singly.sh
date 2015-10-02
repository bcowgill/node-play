#!/bin/bash
# run each test plan singly to see coverage of modules by plan

for plan in `ls test/*.spec.js`
do
	echo " "
	echo $plan
	rm coverage/* doc/coverage/* 2> /dev/null
	grunt --plan $plan
done
