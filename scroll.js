
var myScroll = (function() {
    var scrollMoveObj = null,
        scrollPageY = 0,
        scrollY = 0;
    var scrollDivList = [];
    // obj需要添加滚动条的对象 w滚动条宽度 className滚动条样式名称
    // obj元素 必须指定高度，并设置overflow:hidden;
    // 如要兼容IE6 必须给obj元素 指定 overflow:hidden;
    var jsScroll = function(obj, w, className) {
        if (typeof(obj) == 'string') {
            obj = document.getElementById(obj);
        }
        //当内容未超出现在高度时，不添加滚动条   
        if (!obj || obj.scrollHeight <= obj.clientHeight || obj.clientHeight == 0) {
            return;
        }
        obj.scrollBarWidth = w || 6;
        obj.style.overflow = 'hidden';
        obj.scrollBar = document.createElement('div');
        obj.appendChild(obj.scrollBar);
        obj.scrollBarIndex = document.createElement('div');
        obj.scrollBar.appendChild(obj.scrollBarIndex);
        obj.scrollBar.style.position = 'absolute';
        obj.scrollBarIndex.style.position = 'absolute';
        obj.scrollBarIndex.id="scrollBarIndex";
        obj.scrollBar.className = className || '';
        if (!className) {
            obj.scrollBar.style.backgroundColor = '#fff';
            obj.scrollBarIndex.style.backgroundColor = '#dbdbdb';
        }
        scrollDivList.push(obj);
        scrollResetSize(obj);
        //使用鼠标滚轮滚动
        obj.scrollBar.scrollDiv = obj;
        obj.scrollBarIndex.scrollDiv = obj;
        //鼠标滚轮兼容处理
        function mouseW(obj, fn) {
            if (window.netscape) {
                obj.addEventListener('DOMMouseScroll', fn, false);
            } else {
                obj.onmousewheel = fn;
            }
        }
        mouseW(obj, scrollMove);
        mouseW(obj.scrollBar, scrollMove);
        mouseW(obj.scrollBarIndex, scrollMove);
        // obj.onmousewheel= scrollMove;
        // obj.scrollBar.onmousewheel= scrollMove;
        // obj.scrollBarIndex.onmousewheel = scrollMove;

        //拖动滚动条滚动
        obj.scrollBarIndex.onmousedown = function(evt) {
            evt = evt || event;
            scrollPageY = evt.clientY;
            scrollY = this.scrollDiv.scrollTop;
            isScrollMove = true;
            document.body.onselectstart = function() {
                return false
            };
            scrollMoveObj = this.scrollDiv;
            if (this.scrollDiv.scrollBar.className == '') {
                this.scrollDiv.scrollBarIndex.style.backgroundColor = '#dbdbdb';
            }
            return false;
        }
    }


    //计算滚动条位置
    var scrollResetSize = function(o) {
        if (o.scrollHeight <= o.clientHeight) {
            o.scrollTop = 0;
            o.scrollBar.style.display = 'none';
        } else {
            o.scrollBar.style.display = 'block';
        }
        var p = o;
        var borderTop = parseInt(o.style.borderTopWidth || 0);
        var borderBottom = parseInt(o.style.borderBottomWidth || 0);
        o.scrollBar.style.width = o.scrollBarWidth + 'px';
        o.scrollBar.style.height = o.clientHeight - 10 + 'px';
        o.scrollBar.style.top = borderTop + 10 + 'px';
        o.scrollBar.style.right = 10 + 'px';
        o.scrollBarIndex.style.width = o.scrollBarWidth + 'px';
        o.scrollBarIndex.style.cursor = "pointer";
        // var h = o.clientHeight - (o.scrollHeight - o.clientHeight);
        // //当滚动条滑块最小20个像素
        // if (h < 20) {
        //     h = 20;
        // }
        o.scrollBarHeight = 69;
        o.scrollBarIndex.style.height = 69 + 'px';
        o.scrollBarIndex.style.left = '0px';
        setScrollPosition(o);
    }

    var setScrollPosition = function(o) {
        o.scrollBarIndex.style.top = (o.clientHeight - 10 - o.scrollBarHeight) * o.scrollTop / (o.scrollHeight - o.clientHeight) + 'px';
    }

    document.documentElement.onmousemove = function(evt) {
        if (!scrollMoveObj) return;
        evt = evt || event;
        var per = (scrollMoveObj.scrollHeight - scrollMoveObj.clientHeight) / (scrollMoveObj.clientHeight - scrollMoveObj.scrollBarHeight - 10)
        scrollMoveObj.scrollTop = scrollY - (scrollPageY - evt.clientY) * per;
        setScrollPosition(scrollMoveObj);
    }
    document.documentElement.onmouseup = function(evt) {
        if (!scrollMoveObj) return;
        if (scrollMoveObj.scrollBar.className == '') {
            scrollMoveObj.scrollBarIndex.style.backgroundColor = '#dbdbdb';
        }
        scrollMoveObj = null;
        document.body.onselectstart = function() {
            return true
        };
    }

    // 鼠标滚轮滚动
    var scrollMove = function(evt) {
        if (evt && evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            window.event.cancelBubble = true;
        }
        var div = this.scrollDiv || this;
        if (div.scrollHeight <= div.clientHeight) return true;
        evt = evt || event;
        var step = 20;
        if (evt.wheelDelta < 0 || evt.detail > 0) {
            if (div.scrollTop >= (div.scrollHeight - div.clientHeight)) return true;
            div.scrollTop += step;
        } else {
            if (div.scrollTop == 0) return true;
            div.scrollTop -= step;
        }
        setScrollPosition(div);
        return false;
    }
    var jumpTo = function(o, node) {
        if (o.scrollHeight > o.clientHeight) {
            o.scrollTop = node.offsetTop - o.clientHeight + 39;
            setScrollPosition(o);
        }
    }
    return {
        jsScroll: jsScroll,
        jumpTo: jumpTo
    };
})();s