define([
	'zepto',
	'backbone',
    'Common',

	'Layout/Login.hbs',
    'Model/LoginModel'
], function(
    $, 
    Backbone,
    Common,

    tmpl,
    PageModel
){

	var View = Backbone.View.extend({

		template: tmpl,

        events: {
            'click .js_code': 'toCode',
            'click .js_btn': 'toBtn'
        },

        initialize: function() {
            var self = this;

            self.tel = 0;
        },

        toCode: function(e) {
            var $that = $(e.currentTarget);

            var val = $that.closest('li').find('input').val(),
                tel = val.replace(/[^\d]/g, '');

            if (parseInt(tel, 0)) {
                if (tel.length != 11) {
                    alert('您输入的手机号格式有问题，请重新输入!');
                    return;
                }
            } else {
                alert('请输入手机号!');
                return;
            }

            self.tel = tel;

            var model = new PageModel();

            model.fetch({
                url: Common.url().setPhone,

                data: JSON.stringify({
                    phoneNo: tel
                }),

                type: 'POST',
                contentType: 'application/json',

                success: function(res) {
                    alert("验证码发送成功，请打开手机查看！");
                },

                error: function() {
                    alert("验证码发送失败，请稍后再试！");
                }
            });
        },

        toBtn: function(e) {
            var self = this;

            var num = $('.js_num').val(),
                tel = self.tel;

            if (num.length == 0) {
                alert('请输入验证码！');
                return;
            }

            if (!tel) {
                alert('请输入手机号获取验证码！');
                return;
            }

            var model = new PageModel();

            model.fetch({
                url: Common.url().setCode,

                data: JSON.stringify({
                    phoneNo: tel,
                    captchaCode: num
                }),

                type: 'POST',
                contentType: 'application/json',

                success: function(res) {
                    console.log(res.attributes);
                },

                error: function() {
                    console.log("error");
                }
            });
        },

        render: function() {
            this.setElement( this.template() );

            return this;
        }
	});

	return View;
});
