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
        } catch (err) {}

        sh 'docker build -t authapiserver --no-cache .'
        sh 'docker run -d -p 9011:9011 --name=authapiserver authapiserver:latest'        
      }
    }
  }
  catch (err) {
    throw err
  }
}