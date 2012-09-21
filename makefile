
all: auth-test media-test activity-test list-test message-test user-test
	echo All tests completed successfully!!

auth-test:
	mocha -t 10000 test/auth-test.js

media-test:
	mocha -t 10000 test/media-test.js

activity-test:
	mocha -t 10000 test/activity-test.js

list-test:
	mocha -t 10000 test/list-test.js

message-test:
	mocha -t 10000 test/message-test.js

user-test:
	mocha -t 10000 test/user-test.js

