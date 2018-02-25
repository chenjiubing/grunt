(function(MPT){ 
MPT.define('define/shopCommon',function(){
	var obj = new MPT.klass();

	//清除
	obj.prototype.clear = function() {
		$('tr td,tr th').each(function(){
			$(this).removeClass('backcurrent');
			$(this).removeClass('def');
			if($(this).text() == '已选'){
					$(this).text('未选');
					$(this).removeClass('current');
			}
		});

		$('#vip_type').val('');
		$('#level').val('');
		$('#gid').val('');
		$('input[name="vip_time"]').each(function(){
			if(this.checked == true){
				$(this).removeAttr('checked');
			}
		});
		$('input[name="guizu_time"]').each(function(){
			if(this.checked == true){
				$(this).removeAttr('checked');
			}
		});
		$('#guizu_custom').val('24');
		$('#guizu_custom').attr("disabled",true);
		$('.shop_price b').text(0);
	};


	//选择服务
	obj.prototype.selectService = function(index,gid){
		
		//存入当前级别 包含两种
		var level = index;
		$('#level').val(level);
		//存入当前选择类型
		var is_vip = $('.shop_gz').hasClass('hide');
		if(is_vip){
			$('#vip_type').val(1);
		}else{
			$('#vip_type').val(2);
		}
		//存入GID
		$('#gid').val(gid);

		this.changeMoney();
	};

	//计算金额
	obj.prototype.changeMoney = function(){
		var type = $('#vip_type').val();
		var level = $('#level').val();

		if(type == '' || level == ''){
			this.setMoney(0);
			return;
		}

		var base_money=0;

		if(type==1){
			//处理vip显示逻辑
			//设置三项单月金额
			if(level == 0){
				base_money = 50000;
			}else if(level == 1){
				base_money = 200000;
			}else if(level == 2){
				base_money = 500000;
			}else{
				base_money = 1000000;
			}

			//获得时长
			var month = $('label.on[name="vip_time"]').attr('value');

			if(month==undefined || month==''){
				this.setMoney(0);
				return;
			}

			//获得折扣
			var off = 1;
			if(month==3){
				off = 0.9;
			}else if(month == 6){
				off = 0.85;
			}else if(month == 12){
				off = 0.8;
			}else{
				off=1
			}

			//设置金额
			this.setMoney(off*100*month*base_money/100);

		}else{
			//处理贵族逻辑
			//设置单月金额
			if(level == 0){
				base_money = 299000;
			}else{
				base_money = 499000;
			}
			
			//获得时长
			var month = $('label.on[name="guizu_time"]').attr('value');

			if(month==undefined || month==''){
				this.setMoney(0);
				return;
			}

			if(month == 'custom'){
				if($('#guizu_custom').val()==''){
					month = 0;
				}else{
					month = parseInt($('#guizu_custom').val());
					if(isNaN(month)){
						month = 24;
						$('#guizu_custom').val(24);
					}
				}
			}

			this.setMoney(month*base_money);
		}
	};

	//设置金额
	obj.prototype.setMoney = function(money){
		$('.shop_price b').text(money);
	};

	obj.prototype.changeDefault=function(topIndex){
		if(topIndex == 0){
			this.selectService(0,800001);
			$('label[name=vip_time][value=1]').addClass('on');
			$('input[name=is_mine_vip][value=1]').attr('checked',true);
		}else{
			this.selectService(0,90001);
			$('label[name="guizu_time"][value="1"]').addClass('on');
		}
		this.changeMoney();
	}

	return obj;
})
})(MPT);