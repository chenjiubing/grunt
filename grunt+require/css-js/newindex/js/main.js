//1:配置信息
require.config({
    //定义所有JS文件的基本路径,实际这可跟script标签的data-main有相同的根路径
    baseUrl:"./",
  
    //定义各个JS框架路径名,不用加后缀 .js  
    paths:{   
        "jquery":"css-js/common/js/jquery",
        "common":'css-js/common/js/common',
        "commaa":'css-js/newindex/js/commaa',
    }
});
 
require(["common","jquery",'commaa'],function(common,$,commaa){
   	new common.Drag(('box'));
   	$('a').css({color:'red'});
}); 