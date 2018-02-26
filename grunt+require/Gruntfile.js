module.exports = function (grunt) {

  var root = grunt.file.readJSON('package.json');
  var Dobule = function(n){
      return n>=10 ? n : '0'+n;
    };
  var version = function(){
    var day = new Date();
    var Year, Month, Day, strTime;
      Year  = day.getFullYear();
      Month = day.getMonth()+1;
      Day   = day.getDate();
      Hours = day.getHours();
      Minutes = day.getMinutes();
      Seconds = day.getSeconds();
      strTime=String(Year)+String(Dobule(Month))+String(Dobule(Day))+String(Dobule(Hours))+String(Dobule(Minutes))+String(Dobule(Seconds));
    return strTime;
  }();

  function install(taskName,developPath,packPath){

    grunt.registerTask(taskName,'文件.',function(){
      grunt.log.writeln('开始复制文件');
      packPath = packPath + version;
      grunt.file.recurse(developPath, function(abspath, rootdir, subdir, filename){
        if(filename.indexOf('.DS_Store') != -1) return;
        var newPuths = subdir ? (packPath + '/' + subdir + '/' + filename) : (packPath + '/' + filename);
        grunt.file.copy(abspath,newPuths);
      });
      grunt.log.writeln('复制文件完成');
    });

    var concatTaskName = taskName + '_concat_min';
    grunt.registerTask(concatTaskName,'合并压缩文件',function(){    
      var css = developPath + 'css/miniplanet.css';
      var js = developPath + 'js/miniplanet.js';
      var cssArray = grunt.file.exists(css) ? grunt.file.read(css).match(/[^']\w+\.cs*[^']/g) : false;     
      var jsArray = function(){
            if(!grunt.file.exists(js)) return false;
            var a = grunt.file.read(js);
            return a.substring(a.indexOf('[') + 1,a.indexOf(']'));
          }();
      jsArray = (jsArray) ? jsArray.match(/[^']\w+\/\w+\/\w+[^']/g) : [];
      if(cssArray){
        for(var i = 0 ; i < cssArray.length;i++){
          cssArray[i] = developPath +'css/'+ cssArray[i]
        }
      };      

      if(jsArray){
          for(var i = 0 ; i < jsArray.length;i++){

              jsArray[i] = 'css-js/'+ jsArray[i] + '.js'
          }
      }

      var packEle = {};

      packEle.pkg = root;
      packEle.concat = {};
      if(cssArray){
          packEle.concat.css = {
              src : cssArray,
              dest : packPath + '/css/miniplanet.debug.css'
          }
      }
      if(jsArray){
          packEle.concat.domop = {
              src : jsArray,
              dest : packPath + '/js/miniplanet.debug.js'
          }
      }
      packEle.uglify = {};
      if(jsArray){
          packEle.uglify.options = {
              banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */'
          };
          packEle.uglify.build = {
              src : packPath + '/js/miniplanet.debug.js',
              dest : packPath + '/js/miniplanet.js'
          }
      }
      if(cssArray){
          packEle.cssmin = {};
          packEle.cssmin.css = {
              src: packPath + '/css/miniplanet.debug.css',
              dest: packPath + '/css/miniplanet.css'
          }
      }else{
          packEle.cssmin = {};
          packEle.cssmin.css = false
      }

      grunt.initConfig(packEle);
      grunt.loadNpmTasks('grunt-contrib-concat');
      grunt.loadNpmTasks('grunt-contrib-uglify');
      grunt.loadNpmTasks('grunt-css');

      grunt.registerTask(concatTaskName + '_remove','删除缓存文件.',function(){
          if(grunt.file.exists(packPath + '/css/miniplanet.debug.css')){
              grunt.file.recurse(packPath + '/css/', function(abspath, rootdir, subdir, filename){
                  if(filename!= 'miniplanet.debug.css' && filename!= 'miniplanet.css'){
                      grunt.file.delete(abspath,{force: true});
                  }
              });
          }

          if(grunt.file.exists(packPath + '/js/miniplanet.debug.js')){
              grunt.file.recurse(packPath + '/js/', function(abspath, rootdir, subdir, filename){
                  if(filename!= 'miniplanet.debug.js' && filename!= 'miniplanet.js'){
                      grunt.file.delete(abspath,{force: true});
                  }
              });
          }
      });


      if(cssArray || jsArray){
          if(cssArray && jsArray){
              grunt.registerTask(concatTaskName + '_buildding', ['concat','uglify','cssmin',concatTaskName + '_remove']);
          }else if(cssArray && !jsArray){
              grunt.registerTask(concatTaskName + '_buildding', ['concat','cssmin',concatTaskName + '_remove']);
          }else if(!cssArray && jsArray){
              grunt.registerTask(concatTaskName + '_buildding', ['concat','uglify',concatTaskName + '_remove']);
          }
          grunt.task.run(concatTaskName + '_buildding');        
      }

    });
    grunt.registerTask(developPath, [taskName,concatTaskName]);
    grunt.task.run(developPath);
  }



  /**
  * [createTask description]
  * @param  {[type]} taskName [要打包的文件名]
  */
  function createTask(taskName){
    var developPath = root.developPath+'/'+taskName+'/'; //传入需要打包的路径
    var packPath = root.packPath+'/'+taskName+'/';//传入打包生成的路径
    install(taskName,developPath,packPath);    
  }

  grunt.registerTask('build',function(){
    if(this.args.length == 0){
      grunt.log.writeln('请输入项目名称'); 
    }else{
      for(var i in this.args){ 
        createTask(this.args[i]) 
      }
    }
  });

}

