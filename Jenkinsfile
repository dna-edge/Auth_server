node {
  try {
    stage('Checkout') {
      checkout scm
    }
    stage('Environment') {
      sh 'git --version'
      echo "Branch: master"
      sh 'docker -v'
      sh 'printenv'
    }
    stage('Deploy'){
      if(env.BRANCH_NAME == 'master'){
        try {
          try {
            sh 'cp /home/DNAenv.json .'
          } catch (err) {}

          try {
            sh 'docker rmi -f authapiserver'
          } catch (err) {}

          try {
            sh 'docker rm -f authapiserver'   
          } catch (err) {}

          try {
            sh 'docker rmi $(docker images -f "dangling=true" -q)'
          catch (err) {}
          
          sh 'docker build -t authapiserver --no-cache .'
          sh 'docker run -d -p 9011:9011 --name=authapiserver authapiserver:latest'     
        }
      }
    }
  } catch (e) {
    currentBuild.result = "FAILED"
    throw e
  } finally {
    notifyBuild(currentBuild.result)
  }
}

def notifyBuild(String buildStatus = 'STARTED') {
  buildStatus =  buildStatus ?: 'SUCCESSFUL'

  def colorName = 'RED'
  def colorCode = '#FF0000'
  def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
  def summary = "${subject} (${env.BUILD_URL})"

  if (buildStatus == 'STARTED') {
    color = 'YELLOW'
    colorCode = '#FFFF00'
  } else if (buildStatus == 'SUCCESSFUL') {
    color = 'GREEN'
    colorCode = '#00FF00'
  } else {
    color = 'RED'
    colorCode = '#FF0000'
  }

  slackSend (color: colorCode, message: summary)
}