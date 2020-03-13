#!/usr/bin/env groovy
 
node {
	stage('checkout') {
		checkout scm
	}

	stage('check java') {
		sh "java -version"
	}

	stage('clean') {
		sh "chmod +x mvnw"
			sh "./mvnw clean"
	}

	stage('install tools') {
		sh "./mvnw com.github.eirslett:frontend-maven-plugin:install-node-and-npm -DnodeVersion=v10.16.1 -DnpmVersion=6.9.2"
	}

	stage('npm install') {
		sh "./mvnw com.github.eirslett:frontend-maven-plugin:npm"
	}

	stage('snyk'){
		snykSecurity severity: 'low', snykInstallation: 'snykInt', snykTokenId: 'SNYK_TOKEN'
	}


	stage('package and deploy') {
	    sh "./mvnw com.heroku.sdk:heroku-maven-plugin:2.0.5:deploy -DskipTests -Pprod -Dheroku.buildpacks=heroku/jvm -Dheroku.appName=still-eyrie-46870"
	        archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
	 }
	
	stage('Setup zap') {
		startZap(host: "127.0.0.1", port: 9091, timeout:500, zapHome: "/Applications/OWASP ZAP.app/Contents/Java/", sessionPath:"/Users/fred/session.session", allowedHosts:['https://secuzapsnik.herokuapp.com/']) 
	}
	
    stage('backend tests') {
        try {
              sh "./mvnw verify  -Dhttp.proxyHost=127.0.0.1 -Dhttp.proxyPort=9091 -Dhttps.proxyHost=127.0.0.1 -Dhttps.proxyPort=9091"
          } catch(err) {
              throw err
          } finally {
              junit '**/target/test-results/**/TEST-*.xml'
          }
      }
 
      stage('frontend tests') {
          try {
              sh "./mvnw com.github.eirslett:frontend-maven-plugin:npm -Dfrontend.npm.arguments='run test' -Dhttp.proxyHost=127.0.0.1 -Dhttp.proxyPort=9091 -Dhttps.proxyHost=127.0.0.1 -Dhttps.proxyPort=9091"
          } catch(err) {
              throw err
          } finally {
              junit '**/target/test-results/TESTS-*.xml'
          }
      }

	stage('close zap') {
		archiveZap(failAllAlerts: 1, failHighAlerts: 0, failMediumAlerts: 0, failLowAlerts: 0, falsePositivesFilePath: "zapFalsePositives.json")
	}

}
