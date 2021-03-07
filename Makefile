.DEFAULT_GOAL := annoy

install:
	@touch .env
	@echo "\n\n#$$(date)\n#export GOOGLE_APPLICATION_CREDENTIALS=Path to credentials.json\n\
#export COCKROACH_DB_CERT_PATH=?\n\
#export COCKROACH_DB_HOST=?\n\
#export COCKROACH_DB_PASSWORD=?\n\
#export COCKROACH_DB_DATABASE=?\n" >> .env
	@$(MAKE) node-modules
	@echo "***************************************************\n\nOPEN .ENV AND CHANGE THE VARIABLE TO RUN YOUR ENVIRONMENT\n\nYOU CAN COMMENT OUT LINES WITH # AND HAVE MULTIPLE ENVIRONMENTS\n\n***************************************************"

node-modules: package.json
	npm install

start: package.json
	npm start

annoy:
	killall node|true && killall nodemon|true && . .env && $(MAKE) start