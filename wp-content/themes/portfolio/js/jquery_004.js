/* http://james.padolsey.com/javascript/special-scroll-events-for-jquery/ */

function swl_scrollStopExtend(){

    var special = SWL.$.event.special,
        uid1 = 'D' + (+new Date()),
        uid2 = 'D' + (+new Date() + 1);

    special.scrollstart = {
        setup: function() {

            var timer,
                handler =  function(evt) {

                    var _self = this,
                        _args = arguments;

                    if (timer) {
                        clearTimeout(timer);
                    } else {
                        evt.type = 'scrollstart';
                        SWL.$.event.handle.apply(_self, _args);
                    }

                    timer = setTimeout( function(){
                        timer = null;
                    }, special.scrollstop.latency);

                };

            SWL.$(this).bind('scroll', handler).data(uid1, handler);

        },
        teardown: function(){
            SWL.$(this).unbind( 'scroll',  SWL.$(this).data(uid1) );
        }
    };

    special.scrollstop = {
        latency: 300,
        setup: function() {

            var timer,
                handler = function(evt) {

                    var _self = this,
                        _args = arguments;

                    if (timer) {
                        clearTimeout(timer);
                    }

                    timer = setTimeout( function(){

                        timer = null;
                        evt.type = 'scrollstop';
                        SWL.$.event.handle.apply(_self, _args);

                    }, special.scrollstop.latency);

                };

            SWL.$(this).bind('scroll', handler).data(uid2, handler);

        },
        teardown: function() {
            SWL.$(this).unbind( 'scroll',  SWL.$(this).data(uid2) );
        }
    };

}


function swl_scrollStopInit()
{
    if (typeof(SWL) == 'undefined')
    {
        window.setTimeout(function()
        {
            swl_scrollStopInit();
        }, 50);
        return;
    }
    swl_scrollStopExtend();
}

swl_scrollStopInit();