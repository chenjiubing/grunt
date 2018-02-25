(function(MPT){ 
MPT.require('Action').add('shopTab', function(_element){
	var shopCommon = MPT.require('define/shopCommon');
	$('.shop_Tab a').click(function(){
		$('tr td,tr th').removeClass('backcurrent');
		var tabAIndex = $(this).attr('indexId');
		$(this).addClass('on').siblings('a').removeClass('on');
		$('.shopCont').eq(tabAIndex).removeClass('hide').siblings('.shopCont').addClass('hide');
		shopCommon.clear();
		shopCommon.changeDefault(tabAIndex);
	});
	
	// 是否打开贵族标签
	var winurl = '';
	winurl = window.location.href;
	var patt = new RegExp('accountid');
	var lovercard = new RegExp('lovercard');
	var shh = new RegExp('shh');

	if(patt.test(winurl)){
	 	$('.shop_Tab a').eq(3).trigger("click");
	}
	if(lovercard.test(winurl)){
		$('.shop_Tab a').eq(4).trigger("click");
	}
	if(shh.test(winurl)){
		$('.shop_Tab a').eq(3).trigger("click");
	}

	var urlObj = MPT.require('define/common').getUrlOptions(window.location.href);
	//跳转锚点
	if(urlObj.scrollTop){
		var scrollTop = $('.'+urlObj.scrollTop).offset().top;
		$('body,html').scrollTop(scrollTop);
	}


	$(document).ready(function(){
	  shopCommon.clear();
	  var accountid = $('#init_accountid').val();
	  var nickname = $('#init_nickname').val();
	  if(accountid != '' && nickname != ''){
		  //$('.shop_Tab a').eq(1).trigger("click");
		  shopCommon.changeDefault(1);
		  $('#curr_anchor').val(nickname).css({'color':'#000'});
		  $('#curr_anchor').attr('accountid',accountid);
		  return;
	  }
	  
	  shopCommon.changeDefault(0);
	});

})

MPT.require('Action').add('pitchOn', function(_element){
	var _ajax = MPT.require('define/ajax');
	var shopCommon = MPT.require('define/shopCommon');
	var anchor_data=new Object();
	var tip = MPT.require('define/tip').find($('.shop_gz_aho'));
	var v = new Date().getTime();

	function updataJb(data){
		if(data.money){
			$('.header_login .jb').html(data.money);
		}
	};

	//显示错误消息
	function showMsg(code){
		switch(code){
			case 200:
				alert('购买成功！');
				break;
			case 400:
				alert('购买失败请联系管理员！');
				break;
			case 4300:
				alert('亲，您已经拥有更高等级的VIP了哦！');
				break;
			case 4301:
				//MPT.require('define/tip').create({title:'九秀提醒您',content:'抱歉，您的余额不足！',moreContent:'<a target="_blank" href="'+MPT.Config('PAY_HTTP')+'">点击充值</a>',btn2:false});
				alert('抱歉，您的余额不足！');
				break;
			case 4302:
				alert('您还没有登陆，无权利购买！');
				break;
			case 4303:
				alert('抱歉，您输入的数字id查无此人');
				break;
			case 4304:
				alert('不存在的主播');
				break;
			case 4305:
				alert('亲，您已经拥有更高等级的守护了哦！');
				break;
			case 4306:
				alert('抱歉，没有权限！');
				break;
			case 4307:
				alert('抱歉，没有权限！');
				break;
			default:
				alert('失败，请联系管理员！');
		}
	};

	//单击选择守护主播
	var bindStatus = false;
	$('.select_aho,#curr_anchor').click(function(){
		tip.show();
		var context='';
		$.ajax({ 
			url: "/ajax/shop/getallanchor?v="+v,
			type:'post', 
			dataType:'json',
			data:[], 
			success: function(res){
				if(res.code ==200){
			        for(var i in res.data){
			        	context += '<a class="a" href="javascript:void(0);" nickname="'+res.data[i].nickname+'" title="'+res.data[i].accountid+'">'+res.data[i].nickname+'</a>';
			        }
			        $('.gz_aho_list').html(context);
			        if(!bindStatus){
			        	bindStatus = true;
			        	$('.gz_aho_list').bind('click',select_anchor);
			        }
		    	}
		 	}
		});
	});
	
	//VIP 守护 类型
	$('label[name],.vipTypeBox[name]').click(function(){
		if($('.payVipWarp .kaitong_box .tips').length > 0){
			$('.payVipWarp .kaitong_box .tips').remove();
		}
		var name = $(this).attr('name');
		$(this).addClass('on').siblings().removeClass('on');
		if(name == 'guizu_type'){//守护
			var gid=$(this).attr('gid');
			shopCommon.selectService($(this).index(),gid);
		}else if(name == 'vip_type'){//VIP
			var gid=$(this).attr('gid');
			shopCommon.selectService($(this).index(),gid);	
		}else if(name == 'vip_time'){//月份事件  计算金额
			shopCommon.changeMoney();	
		}else if(name == 'guizu_time'){//月份事件  计算金额
			var v = $(this).attr('value');
			if(v == 'custom'){
				$('#guizu_custom').attr("disabled",false);
				$('#guizu_custom').focus();
				$('label[name="guizu_time"]').removeClass('on');
				$(this).addClass('on');
			}else{
				$('label[name="guizu_time"][value="custom"]').removeClass('on');
				$('#guizu_custom').val('24');
				$('#guizu_custom').attr("disabled",true);
			}
			shopCommon.changeMoney();	
		}
	});

	$('#vip_accountid,.user2Label').click(function(){
		$('#user2').click();
	});

	$('input[name="is_mine_vip"]').click(function(){
		var v = $(this).val();
		if(v == 2){
			$('#vip_accountid').val('').focus();
		}else{
			$('#vip_accountid').val('请输入好友靓号');
		}
	});

	// $('#guizu_custom').click(function(){
	// 	$('input[name=guizu_time][value=custom]').attr('checked',true);
	// });
	// $('#vip_accountid').click(function(){
	// 	$('input[name=is_mine_vip][value=2]').attr('checked',true);
	// });
	
	//绑定事件
	if($.browser.msie){
		document.getElementById('guizu_custom').onpropertychange = function(){
			shopCommon.changeMoney();
		}
		document.getElementById('search_anchor').onpropertychange = function(){
			search_anchor();
		}
	}else{
		$('#guizu_custom').bind('input',function(){
			shopCommon.changeMoney();
		});
		$('#search_anchor').bind('input',function(){
			search_anchor();
		});
	}

	// $("#curr_anchor").focus(function(){
	// 	var strobj = $("#curr_anchor");
	// 	strobj.css("color","#000");
	// 	if(strobj.val() != "请输入房间号/主播昵称" && strobj.val() != ''){
	// 		strobj.css("color","#000");	
	// 	}else{
	// 		strobj.val('');	
	// 	}
	// });
	
	// $("#curr_anchor").blur(function(){
	// 	var strobj = $("#curr_anchor");
	// 	if(strobj.val() == ''){
	// 		strobj.val('请输入房间号/主播昵称').css("color","#C2C2C2");
	// 	}
	// });
	
	// $('#curr_anchor').keyup(function(){
	// 	var val = $('#curr_anchor').val();
	// 	$('#curr_anchor').attr('accountid',val);
	// })
	
	$('.srollTop span').click(function(){
		$(window).scrollTop(0);	
	})

	$('.toPay').click(function(){
		if(MPT.require("define/checkLogin").recharge()){
			window.location.href = MPT.Config('PAY_HTTP');	
		}else{
			MPT.require('define/loginBox').setUp();
		}	
	});
	
	$('.prop_box a').mouseenter(function(){
		$('.prop_pop').show();	
	}).mouseleave(function(){
		$('.prop_pop').hide();
	});

	//页面搜索
	function search_anchor(){
		var search_text = $('#search_anchor').val();
		if(search_text!=''){
			$('.gz_aho_list').find('a').each(function(){
				$(this).addClass('hide');
			});
		}else{
			$('.gz_aho_list').find('a').each(function(){
				$(this).removeClass('hide');
			});
		}

		
		$(".gz_aho_list a[nickname^='"+search_text+"']").each(function(){
			$(this).removeClass('hide');
		});
	}

	//选择主播
	function select_anchor(obj){
		var target = obj.target;
		if(!$(target).hasClass('a')) return;
		$('#curr_anchor').val($(target).html()).css({'color':'#000'});
		$('#curr_anchor').attr('accountid',$(target).attr('title'));
		tip.hide();
		_ajax.ajax({
			url: '/ajax/shop/getanchorinfo?accountid='+$(target).attr('title'),
			callback : function(data){
				if(data.code == 200){
					getGuardAhoInfo(data.data);
				}else{
					MPT.require('define/tip').create(false,data.message);
				}
			}
		})
	}
	
	//获取主播信息
	function getGuardAhoInfo(obj){
		var str = [];
		str.push('<dt><img class="headimage" src="'+obj.headimage+'"/><span>主播等级：<em class="icon_live_level icon_live_level_'+obj.livelevel+'"></em></span></dt>');
		if(obj.webhallposter){
			str.push('<dd><img class="avatar" src="'+obj.webhallposter+'"/></dd>');
		}
		$('.payGuardBox_list .guardAhoInfo').html(str.join(''));
	}

	//vip提交按钮
	var payStartus = false;
	$('.kaitong').click(function(){
		if(!MPT.require("define/checkLogin").recharge()) return;
		var type = $('#vip_type').val();
		var gid = $('#gid').val();
		if(gid==''){
			alert('请选择产品');
			return;
		}
		//vip
		if(type==1){
			var data = new Object();

			//获得时长
			var month = $('label.on[name="vip_time"]').attr('value');

			if(month==undefined || month==''){
				alert('请选择时长');
				return;
			}



			var is_mine = $('input[name="is_mine_vip"]:checked').val();
			if(is_mine==2){
				data.accountid = $('#vip_accountid').val();
				if(data.accountid == ''){
					alert('请填写对方编号');
					return;
				}
			}
			data.gid = gid;
			data.month = month;
			data.confirm = 1;
			if(payStartus) return;
			payStartus = true;
			if($('.payVipWarp .kaitong_box .tips').length > 0){
 				$('.payVipWarp .kaitong_box .tips').remove();
 			}
			$.ajax({ url: "/ajax/shop/buyvip?v="+v,type:'post', dataType:'json',data:data, success: function(res){
		        if(res.code==4306){
		        	payStartus = false;
					var r=confirm("新的vip会替换现有vip效果，确认操作吗？");
				     if (r==true){
				    	 	data.confirm = 2;
				    	 	$.ajax({ url: "/ajax/shop/buyvip?v="+v,type:'post', dataType:'json',data:data, success: function(resc){
				    	 		if(resc.code == 200){
				    	 			updataJb(resc.data);
				    	 			MPT.require('define/tip').create(false,'购买成功！');
				    	 		}else if(resc.code == 4301){
				    	 			$('.payVipWarp .kaitong_box').append('<em class="tips">九币不足！</em>');
				    	 		}else{
									showMsg(resc.code);	
				    	 		}
						}});
				     }else{
				    	 return;
				     }
				}else if(res.code == 4301){
					payStartus = false;
					$('.payVipWarp .kaitong_box').append('<em class="tips">九币不足！</em>');
				}else{
					payStartus = false;
					if(res.code == 200){
	    	 			updataJb(res.data);
	    	 			showMsg(res.code);
	    	 		}else{
	    	 			showMsg(res.code);	
	    	 		}
				}
		        
		      }});
			
		}else if(type == 2){ //贵族
			
			var data = new Object();
			//获得时长
			var month = $('label.on[name="guizu_time"]').attr('value');

			if(month==undefined || month==''){
				alert('请选择时长');
				return;
			}
			if(month=='custom'){
				month = parseInt($('#guizu_custom').val());
			}
			if(isNaN(month) || month ==0){
				alert('请选择时长');
				return;
			}
			//获得主播
			var accountid = $('#curr_anchor').attr('accountid');
			if(accountid==undefined || accountid==''){
				alert('请选择主播');
				return;
			}
			data.gid = gid;
			data.month = month;
			data.accountid = accountid;
			if(gid == 90003){
				MPT.require('define/tip').create({title:'九秀提醒您',content:'<p><img class="headimage" style="width:50px;height:50px;border-radius:50%;margin-right:15px;" src="'+$('.payGuardBox_list .guardAhoInfo .headimage').attr('src')+'"/><span>财富等级：<em class="'+$('.payGuardBox_list .guardAhoInfo dt em').attr('class')+'"></em></span></p><p>您是否购买钻石守护？<br/>(普通守护会以2:1折算成钻石守护)</p>',moreContent:false,btn2:{
					status : true,
					name:'取消',
					callback:function(){
						MPT.require('define/tip').find($('.Popup_public')).remove();
					}
				},btn1:{
					status : true,
					name : '确定',
					callback : function(){
						MPT.require('define/tip').find($('.Popup_public')).remove();
						$.ajax({ url: "/ajax/shop/buyguizu?v="+v,type:'post', dataType:'json',data:data, success: function(res){
							if(res.code == 200){
								updataJb(res.data);
							}
							showMsg(res.code);
						  }});
					}
				}});	
			}else{
				MPT.require('define/tip').create({title:'九秀提醒您',content:'<p><img class="headimage" style="width:50px;height:50px;border-radius:50%;margin-right:15px;" src="'+$('.payGuardBox_list .guardAhoInfo .headimage').attr('src')+'"/><span>财富等级：<em class="'+$('.payGuardBox_list .guardAhoInfo dt em').attr('class')+'"></em></span></p><p>确定为其开通守护吗？</p>',moreContent:false,btn2:{
					status : true,
					name:'取消',
					callback:function(){
						MPT.require('define/tip').find($('.Popup_public')).remove();
					}
				},btn1:{
					status : true,
					name : '确定',
					callback : function(){
						MPT.require('define/tip').find($('.Popup_public')).remove();
						$.ajax({ url: "/ajax/shop/buyguizu?v="+v,type:'post', dataType:'json',data:data, success: function(res){
							if(res.code == 200){
								updataJb(res.data);
							}
							showMsg(res.code);
						  }});	
					}
				}});
			}
			
		}else{//有问题的输入
			alert('请选择产品!');
		}
	});


	// 爱心卡 购买

	$('.lover_card').click(function(){

		var url = '/ajax/shop/buyLoverCard?v='+v;

		$.get(url,function(data){

			if(data.code == 200){
				MPT.require('define/tip').create(false,'购买成功！');
				updataJb(data.data);
				return;
			}else if(data.code == 4302){
				MPT.require('define/loginBox').setUp();
				return;
			}else if(data.code == 4301){
				MPT.require('define/tip').create();
				return;
			}else if(data.code == 400){
				MPT.require('define/tip').create(false,'购买失败，请重试！');
				return;
			}else{
				showMsg(data.code);	
	 		}

		})
	})

	// 隐身卡 购买
	var payStartus9 = false;
	$('.ys_but').click(function(){

		if(!MPT.require("define/checkLogin").recharge()) return;
		if(payStartus9) return;
		payStartus9 = true;

		_ajax.ajax({
			url : '/ajax/shop/buyStealthCard?',
			data : {type:1},
			type : 'post',
			callback : function(res){
				if(res.code == 200){

					payStartus9 = false;
					if($('.shop_accountid_pop').length > 0) return;
					$('body').append(shop_pop_str(res.data,'ys'));
					MPT.require('define/Masklayer').show();
					shopLhBind('ys');

				}else{
					payStartus9 = false
					MPT.require('define/tip').create(false,res.message);
				}
			}
		});
	});


	// 置顶卡 购买

	$('.top_card').click(function(){

		var url = '/ajax/shop/buyTopCard?num=1&v='+v;

		$.get(url,function(data){

			if(data.code == 200){
				MPT.require('define/tip').create(false,'购买成功！');
				updataJb(data.data);
				return;
			}else if(data.code == 4302){
				MPT.require('define/loginBox').setUp();
				return;
			}else if(data.code == 4301){
				MPT.require('define/tip').create();
				return;
			}else if(data.code == 400){
				MPT.require('define/tip').create(false,'购买失败，请重试！');
				return;
			}else{
				showMsg(data.code);	
	 		}

		})
	})


	// 斗图卡 购买
	var payStartus7 = false;
	$('.dt_but').click(function(){

		if(!MPT.require("define/checkLogin").recharge()) return;
		if(payStartus7) return;
		payStartus7 = true;

		_ajax.ajax({
			url : '/ajax/shop/buyPictureCard?',
			data : {type:1},
			type : 'post',
			callback : function(res){
				if(res.code == 200){

					payStartus7 = false;
					if($('.shop_accountid_pop').length > 0) return;
					$('body').append(shop_pop_str(res.data,'dt'));
					MPT.require('define/Masklayer').show();
					shopLhBind('dt');

				}else{
					payStartus7 = false
					MPT.require('define/tip').create(false,res.message);
				}
			}
		});
	});
	
	
	//靓号事件
	//靓号搜索只匹配小于8位数字
	var search_lh_input_txt;
	$('.search_lh_input').keyup(function(){
		if($(this).val().search('^[0-9]*$') > -1){
			if($(this).val().length > 7){
				$(this).val(search_lh_input_txt);
			}else{
				search_lh_input_txt = $(this).val();
			}
		}else{
			$(this).val(search_lh_input_txt);
		}
	})

	$('.lh_search_sm').mouseenter(function(){
		$('.lh_search_sm_pop').show();
	}).mouseleave(function(event) {
		$('.lh_search_sm_pop').hide();
	});

	$('.lh_tj_sm').mouseenter(function(){
		$('.lh_tj_sm_pop').show();
	}).mouseleave(function(event) {
		$('.lh_tj_sm_pop').hide();
	});
	
	var searchDOM = function(data){
		var d = [];
		d.push('<div class="shop_lh_item" profit="'+data.profit+'" account="'+data.accountid+'">');
		d.push('<a href="javascript:;">');
		d.push('<p class="shop_ico shop_lh_bg">'+data.accountid+'</p>');
		d.push('<p class="profit"><span style="color:#FA3376">'+data.profit+'%</span> 经验加成</p>');
		d.push('<p class="txt"><em>'+data.price+'九币</em><b class="btn" account="'+data.accountid+'" price="'+data.price+'">购买</b></p>');
		d.push('</a>');
		d.push('</div>');
		return d.join('');
	}
	$('.search_lh_btn').click(function(){
		if($('.search_lh_input').val().length < 3 || $('.search_lh_input').val() == ''){
			MPT.require('define/tip').create(false,'请输入最少3位的靓号');
			return;
		} 
		_ajax.ajax({
			url: '/shop/search?accountid='+$('.search_lh_input').val(),
			callback : function(data){
				if(data.code == 200){
					var data = data.data;
					var html = '';
					for(var a = 3;a < 8;a++){
						if(typeof(data[a]) != "undefined" && data[a].length > 0){
							html += '<div class="shop_lh_list shop_lh_list_'+(a-2)+' clearfix">';
							for(var i = 0;i < data[a].length;i++){
								html += searchDOM(data[a][i]);
							}
							html += '</div>';
						}
					}
					if(html == ''){
						html += '<img class="search_lh_nodata" src="http://img1.img.9xiu.com/public/webImg/shop/search_nodata.png"/>';
					}
					$('.search_lh_cont_Box .shop_lh_cbox').html(html);
					$('.shop_lh_box').eq(0).addClass('hide');
					$('.shop_lh_box').eq(1).removeClass('hide');
				}
			}
		})
	})

	$('.return_tj_lh').click(function(){
		$('.shop_lh_box').eq(1).addClass('hide');
		$('.shop_lh_box').eq(0).removeClass('hide');
	})

	var carFC2;
	var carShowTime2;
	var outtime = 8000;
	$('.zszj_list em').click(function(){
		var id = $(this).attr('carid');
		if(carFC2 == id) return;
		carFC2 = id;
		$('embed.carFlashBox').remove();
		$('.carFlashBox').append('<embed src="http://img3.img.9xiu.com/public/webImg/shop/'+id+'.swf" wmode="transparent" width="1000" height="570" class="flash carFlashBox" type="" style="pointer-events: none;">');
		if(id == 'z1_7' || id == 'z2_7'){
			outtime = 10000;
		}else{
			outtime = 8000;
		}
		clearTimeout(carShowTime2);
		carShowTime2 = setTimeout(function(){
			$('embed.carFlashBox').remove();
			carFC2 = '';
		},outtime)
	})

	var carFC;
	var carShowTime;
	$('.shop_car .lockCar').click(function(){
		var id = $(this).attr('carid');
		var swfsecond = parseInt($(this).attr('swfsecond')) * 1000;
		if(carFC == id) return;
		carFC = id;
		$('embed.shopCarFlash').remove();
		$('.shopCarFlashBox').append('<embed src="http://img3.img.9xiu.com/public/webImg/shop/shopCar/'+id+'.swf" wmode="transparent" width="1000" height="570" class="flash shopCarFlash" type="" style="pointer-events: none;">');
		clearTimeout(carShowTime);
		carShowTime = setTimeout(function(){
			$('embed.shopCarFlash').remove();
			carFC = '';
		},swfsecond)	
	})

	// $('.shop_lh_box').delegate('.shop_lh_item', 'mouseenter', function(event) {
	// 	var d = '<p class="shop_lh_sm_pop shop_lh_item_pop"><i style="color:#fa265d;margin-right:5px;">'+$(this).attr('profit')+'%</i>经验加成</p>';
	// 	$(this).append(d);
	// 	$('.shop_lh_item_pop').show();
	// });
	// $('.shop_lh_box').delegate('.shop_lh_item', 'mouseleave', function(event) {
	// 	$('.shop_lh_item_pop').remove();
	// })
	
	//靓号&&座驾购买弹层&&斗图卡&&隐身卡
	var shop_pop_str = function(data,type,carInfo){
		var d = [];
		d.push('<div class="shop_accountid_pop clearfix">');
		d.push('<p class="close"><a href="javascript:;" class="shop_ico"></a></p>');
		d.push('<div class="accountid_pop_l fn_left">');
		if(type == 'lh'){
			d.push('<div class="shop_lh_bg shop_lh_bg'+(data.bit-2)+'">'+data.accountid+'</div>');
		}else if(type == 'car'){
			d.push('<div class="carImg"><img src="http://img3.img.9xiu.com/resource/mobile/image/car/car'+carInfo.carid+'.png" /></div>');
		}else if(type == 'dt'){
			d.push('<div class="carImg"><img src="http://img.img.9xiu.com/public/webImg/shop/2000353.png" /></div>');
		}else if(type == 'ys'){
			d.push('<div class="carImg"><img src="http://img.img.9xiu.com/public/webImg/usercenter/2000069.png" /></div>');
		}
		d.push('<dl>');
		if(type == 'lh'){
			d.push('<dt>靓号：'+data.accountid+'</dt><dd>'+data.price+'九币/月</dd><dd>'+data.profit+'% 额外经验加成</dd>');
		}else if(type == 'car'){
			if(carInfo.forever == 0){
				d.push('<dt>'+carInfo.carName+'</dt><dd>'+data.price+'九币/月</dd>');
			}else{
				d.push('<dt>'+carInfo.carName+'</dt><dd>'+data.price+'九币/月</dd><dd>使用期限：永久</dd>');
			}
		}else if(type == 'dt' || type == 'ys'){
			d.push('<dd>'+data.price+'九币/月</dd>');
		}
		d.push('</dl>');
		if(type == 'lh' || type == 'dt' || type == 'ys'){
			d.push('<ul><li>按月购买:30天/月</li><li>按年购买：365天/年</li></ul>');
		}else if(type == 'car'){
			if(carInfo.forever == 0){
				d.push('<ul><li>按月购买:30天/月</li><li>按年购买：365天/年</li></ul>');
			}
		}
		d.push('<p>商品有限期内购买本产品，有效期进行累加。其他情况，有效期从购买时算起</p>');
		d.push('</div>');

		d.push('<div class="accountid_pop_r fn_right">');

		d.push('<div class="accountid_user">');
		d.push('<em>开通账号：</em>');
		d.push('<span class="touser">');		
		d.push('<b>'+data.nickname+'</b>');	
		d.push('<input type="text" id="buy_accountid_user" placeholder="请输入对方靓号" />');
		d.push('</span>');
		d.push('<a href="javascript:;" class="checkuser" check="1">赠送他人</a>');
		d.push('</div>');

		d.push('<div class="buy_accountid_info">');

		d.push('<div class="buy_item checkMonth">');
		d.push('<span>购买方式：</span>');
		if(type == 'lh' || (type == 'car' && carInfo.forever == 0) || type == 'dt' || type == 'ys'){
			d.push('<b type="month" class="on">按月购买</b>');
			d.push('<b type="year">按年购买</b>');
		}else{
			d.push('<b type="forever" class="on">永久购买</b>');
		}
		d.push('</div>');

		if(type == 'lh' || (type == 'car' && carInfo.forever == 0) || type == 'dt' || type == 'ys'){
			d.push('<div class="buy_item">');
			d.push('<span>购买时长：</span>');
			d.push('<select id="buy_accountid_month">');
			for(var i = 1;i < 11;i++){
				d.push('<option value="'+i+'">'+i+'</option>');
			}
			d.push('</select>');
			d.push('<select id="buy_accountid_year">');
			d.push('<option value="1">1</option>');
			d.push('<option value="2">2</option>');
			d.push('</select>');
			d.push('<b class="buy_accountid_company">月</b>');
			d.push('</div>');
		}
		

		d.push('<div class="buy_item buy_accountid_money">');
		d.push('<span>应付金额：</span>');

		d.push('<em>'+data.price+'</em>九币');
		
		d.push('</div>');

		d.push('<div class="buy_item">');
		d.push('<span>账户余额：</span>');
		d.push('<em>'+data.money+'</em>九币');
		d.push('</div>');

		d.push('<div class="buy_item buy_lh_btn">');
		if(type == 'lh'){
			d.push('<a href="javascript:;" class="buy_item_btn buy_lh" price="'+data.price+'" accountid="'+data.accountid+'">购买</a>');
		}else if(type == 'car'){
			d.push('<a href="javascript:;" class="buy_item_btn buy_car" price="'+data.price+'" yearprice="'+data.yearprice+'" accountid="'+carInfo.carid+'">购买</a>');
		}else if(type == 'dt'){
			d.push('<a href="javascript:;" class="buy_item_btn buy_dt" price="'+data.price+'">购买</a>');
		}else if(type == 'ys'){
			d.push('<a href="javascript:;" class="buy_item_btn buy_ys" price="'+data.price+'">购买</a>');
		}
		d.push('</div>');

		d.push('</div>');
		d.push('</div>');
		d.push('</div>');
		return d.join('');
	}

	var payStartus3 = false;
	$('.shop_lh_box').delegate('.shop_lh_item','click',function(event) {
		var accountid = $(this).attr('account');
		if(!MPT.require("define/checkLogin").recharge()) return;
		if(payStartus3) return;
		payStartus3 = true;
		_ajax.ajax({
			url : '/shop/getAccountIdInfo?accountid='+accountid,
			callback : function(res){
				if(res.code == 200){
					payStartus3 = false;
					if($('.shop_accountid_pop').length > 0) return;
    	 			$('body').append(shop_pop_str(res.data,'lh'));
    	 			MPT.require('define/Masklayer').show();
    	 			shopLhBind('lh');
    	 		}else{
    	 			payStartus3 = false
    	 			MPT.require('define/tip').create(false,res.message);
    	 		}
			}
		})
	});

	var payStartus4 = false;
	$('.buy_car_pop,.send_car_pop').click(function(){
		var send = $(this).attr('sendCar');
		if(!MPT.require("define/checkLogin").recharge()) return;
		if(payStartus4) return;
		payStartus4 = true;
		var carInfo = {
			'carName' : $(this).parents('.shop_car_item').attr('data-name'),
			'price' : $(this).parents('.shop_car_item').attr('data-price'),
			'carid' : $(this).parents('.shop_car_item').attr('data-carid'),
			'forever' : $(this).parents('.shop_car_item').attr('data-forever'),
			'yearprice' : $(this).parents('.shop_car_item').attr('data-yearprice')
		}
		_ajax.ajax({
			url : '/ajax/car/getCarOrderInfo?carid='+carInfo.carid,
			callback : function(res){
				if(res.code == 200){
					payStartus4 = false;
					if($('.shop_accountid_pop').length > 0) return;
					$('body').append(shop_pop_str(res.data,'car',carInfo));
    	 			MPT.require('define/Masklayer').show();
    	 			shopLhBind('car');
    	 			if(send == '1'){
						$('.checkuser').click();
					}
    	 		}else{
    	 			payStartus4 = false
    	 			MPT.require('define/tip').create(false,res.message);
    	 		}
			}
		})
	});

	function shopLhBind(type){

		function accountidMoney(money,month){
			var num = parseInt(money) * parseInt(month);
			$('.buy_accountid_money em').html(num);
		}

		$('.shop_accountid_pop .close').bind('click',function(){
			$('.shop_accountid_pop').remove();
			MPT.require('define/Masklayer').hide();
		})

		$('.accountid_user .checkuser').bind('click',function(){
			$('.buy_accountid_info .checkMonth b').eq(0).addClass('on').siblings('b').removeClass('on');
			$('#buy_accountid_month,#buy_accountid_year').find('option:eq(0)').attr("selected",true);
			$('#buy_accountid_month').show().siblings('select').hide();
			$('.buy_accountid_company').html('月');
			accountidMoney($('.buy_item_btn').attr('price'),1);
			if($(this).attr('check') == 1){
				$(this).attr('check','2').html('买给自己');
				$('.accountid_user .touser b').hide().siblings().show();
				$('.accountid_user .touser #buy_accountid_user').val('');
			}else{
				$(this).attr('check','1').html('赠送他人');
				$('.accountid_user .touser #buy_accountid_user').hide().siblings().show();
			}
		})

		$('.buy_accountid_info .checkMonth b').bind('click',function(){
			$(this).addClass('on').siblings('b').removeClass('on');
			$('#buy_accountid_month,#buy_accountid_year').find('option:eq(0)').attr("selected",true);
			if($(this).attr('type') == 'month' || $(this).attr('type') == 'forever'){
				$('#buy_accountid_month').show().siblings('select').hide();
				$('.buy_accountid_company').html('月');
				accountidMoney($('.buy_item_btn').attr('price'),1);
			}else{
				$('#buy_accountid_year').show().siblings('select').hide();
				$('.buy_accountid_company').html('年');
				accountidMoney($('.buy_item_btn').attr('price'),12);
			}
		})

		$('#buy_accountid_month').bind('change',function(){
			var val = $('#buy_accountid_month option:checked').val();
			accountidMoney($('.buy_item_btn').attr('price'),val);
		})

		$('#buy_accountid_year').bind('change',function(){
			var val = $('#buy_accountid_year option:checked').val();
			if(type == 'lh'){
				accountidMoney($('.buy_item_btn').attr('price'),parseInt(val)*12);
			}else if(type == 'car'){
				accountidMoney($('.buy_item_btn').attr('yearprice'),parseInt(val));
			}else if(type == 'dt'){
				accountidMoney($('.buy_item_btn').attr('price'),parseInt(val)*12);
			}
			
		})

		//购买座驾
		var IspayStartus = false;
		$('.buy_car').click(function(){
			goShop('/ajax/car/buyCar?',IspayStartus,'/my/mystock/myCar','car',$(this).attr('accountid'));	
		});

		// 购买靓号
		$('.buy_lh').bind('click',function(){
			goShop('/ajax/shop/buyAccountId?',IspayStartus,'/shop?index=4','lh',$(this).attr('accountid'));			
		});
		
		// 购买斗图卡		
		$('.buy_dt').bind('click',function(){
			goShop('/ajax/shop/buyPictureCard?',IspayStartus,'/shop?index=3','dt');			
		});

		// 隐身卡
		$('.buy_ys').bind('click',function(){
			goShop('/ajax/shop/buyStealthCard?',IspayStartus,'/shop?index=3','ys');			
		});	

		/**
		 * [goShop 购买]
		 * @param  {[type]} url 		[地址]
		 * @param  {[type]} isFlag 		[开关]
		 * @param  {[type]} link 		[跳转地址]
		 * @param  {[type]} type 		[类型]
		 * @param  {[type]} accountid 	[靓号]
		*/
		function  goShop(url,isFlag,link,type,accountid){

			var data = {};

			if(type == 'car'){
				if($('.buy_accountid_info .checkMonth b.on').attr('type') == 'month'){
					var month = $('#buy_accountid_month option:checked').val();
					data.type = 0;
				}else if($('.buy_accountid_info .checkMonth b.on').attr('type') == 'year'){
					var month = parseInt($('#buy_accountid_year option:checked').val());
					data.type = 1;
				}else if($('.buy_accountid_info .checkMonth b.on').attr('type') == 'forever'){
					month = 1;
					data.type = 2;
				}
			}else{

				if($('.buy_accountid_info .checkMonth b.on').attr('type') == 'month'){
					var month = $('#buy_accountid_month option:checked').val();
				}else{
					var month = parseInt($('#buy_accountid_year option:checked').val())*12;
				}				
			}


			if(month==undefined || month==''){
				alert('请选择时长');
				return;
			}

			var is_mine = $('.accountid_user .checkuser').attr('check');
			if(is_mine == 2){
				data.touser = $('#buy_accountid_user').val();
				if(data.touser == ''){
					alert('请填写对方靓号');
					$('#buy_accountid_user').focus();
					return;
				}

				if(isNaN(data.touser) || data.touser.length < 3 || data.touser.length > 8){
					alert('靓号必须为3-8位数字');
					$('#buy_accountid_user').val('').focus();
					return;
				}
			}

			if(type == 'ys' || type == 'dt'){
				data.type=0;
				data.accountid = accountid;	
				data.month = month;			
			}else if( type == 'lh'){
				data.accountid = accountid;
				data.month = month;
			}else if(type == 'car'){
				data.carid = accountid;
				data.times = month;
			}

			if(isFlag) return;
			isFlag = true;
			_ajax.ajax({
				url : url,
				data : data,
				type : 'post',
				callback : function(res){
					if(res.code == 4301){
						isFlag = false;
						MPT.require('define/tip').create({
							title : '提示',
							content : '余额不足,请先充值,更多好玩的等着你！',
							moreContent : '<a href="'+MPT.Config('PAY_HTTP')+'" target="_blank">首次充值，免费送价值50000九币豪礼！</a>',
							btn1 : {
								status : true,
								name : '确定',
								callback : function(){
									$('.Popup_public').remove();
								}
							},
							btn2 : {
								status : true,
								name : '充值',
								callback : function(){
									window.open(MPT.Config('PAY_HTTP'));
								}
							},
							close : false
						});	
					}else{
						isFlag = false;
						if(res.code == 200){
		    	 			updataJb(res.data);
		    	 			MPT.require('define/tip').create({
								title : '提示',
								content : '购买成功！',
								moreContent : '',
								btn1 : {
									status : true,
									name : '确定',
									callback : function(){
										window.location.href = link;
									}
								},
								btn2 : false,
								close : false
							});	
		    	 		}else{
							MPT.require('define/tip').create({
								title : '提示',
								content : res.message,
								moreContent : '',
								btn1 : {
									status : true,
									name : '确定',
									callback : function(){
										$('.Popup_public').remove();
									}
								},
								btn2 : false,
								close : false
							});	
		    	 		}
					}
				}
			});
		}
	}	
})
})(MPT);