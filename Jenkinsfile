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
       
        sh 'docker rmi $(docker images -f "dangling=true" -q)'
        sh 'docker build -t authapiserver --no-cache .'
        sh 'docker run -d -p 9008:9008 --name=authapiserver authapiserver:latest'        
      }
    }
  }
  catch (err) {
    throw err
  }
}