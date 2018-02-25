module.exports = function(grunt) {

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

	 /**
	  * [install description]
	  * @param  {[type]} taskName    [任务名]
	  * @param  {[type]} developPath [路径:pack]
	  * @param  {[type]} packPath    [路径:css-js]
	  */
	function install(taskName,developPath,packPath){

		//注册任务：拷贝打包的文件
    	grunt.registerTask(taskName,'文件.',function(){

    		grunt.log.writeln('开始复制文件完成');

    		packPath = packPath + version;

	        grunt.file.recurse(developPath, function(abspath, rootdir, subdir, filename){ //abspath:所要复制文件里面所有的文件路径 rootdir:所要复制文件夹的路径 subdir：大文件夹里面包含的小文件夹 filename:单个文件的名字

	        	if(filename.indexOf('.DS_Store') != -1) return;

	        	var newPuths = subdir ? (packPath + '/' + subdir + '/' + filename) : (packPath + '/' + filename);

	            grunt.file.copy(abspath,newPuths);	

	        });

	        grunt.log.writeln('复制文件完成');
        });


        // 注册任务：合并压缩删除
        var concatTaskName = taskName + '_concat_min';
        grunt.registerTask(concatTaskName,'合并压缩文件.',function(){
 		
 		    var css = developPath + 'css';
 		    var js  = developPath + 'js';
			var cssArray = grunt.file.exists(css) ? grunt.file.read(css).match(/[^']\w+\.cs*[^']/g) : false;
			var jsArray = function(){
                if(!grunt.file.exists(js)) return false;
				var a = grunt.file.read(js);
				return a.substring(a.indexOf('[') + 1,a.indexOf(']'));
			}();

			jsArray = (jsArray) ? jsArray.match(/[^']\w+\/\w+[^']/g) : false;

			grunt.log.writeln(jsArray);

        	var packEle = {
        		concat:{ //合并
        			css:{//css
        				src : packPath+'/css/*.css',
				    	dest : packPath +'/css/miniplanet.debug.css'
        			},
        			domop:{//js
        				src : packPath+'/js/**/*.js',
                    	dest : packPath + '/js/miniplanet.debug.js'
        			}
        		},
        		cssmin:{ //压缩css
        			css:{
        				src: packPath + '/css/miniplanet.debug.css',
	                	dest: packPath + '/css/miniplanet.css'
        			}
        		},
        		uglify:{//压缩js
        			build:{
	                    src : packPath + '/js/miniplanet.debug.js',
	                    dest : packPath + '/js/miniplanet.js'
        			}
                }
        	};            	

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
                    grunt.registerTask(concatTaskName + '_buildding', ['concat','uglify','cssmin']);
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
				grunt.log.writeln(this.args);
				createTask(this.args[i]);
			}

		}
	});      
};