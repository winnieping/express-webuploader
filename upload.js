//点击开始上传，显示弹框
$('.start').click(function(){
	if($('.popbox').css("visibility")=== "hidden") {
		$('.popbox').css("visibility","visible");
	}
});
//点击取消按钮，关闭弹框
$('.cancel-btn').click(function(){
    setState('cancel');
});

var state;// 当前状态

//初始化Web Uploader
var uploader = WebUploader.create({
    server: 'http://localhost:8000/file',
    // server:'',
    pick: {
    	id:'#filePicker',
    },
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/jpg,image/jpeg,image/png'
    },
    thumb: {
    	width: 110,
		height: 110,
		allowMagnify: false,
		crop: true,
		type: 'image/jpeg',
    },
    fileNumLimit: 300,
    fileSizeLimit: 10 * 1024 * 1024,    // 200 M
    // fileSingleSizeLimit: 50 * 1024 * 1024,    // 50 M
});
//再次添加按钮
uploader.addButton({
    id: '#filePicker2',
    label: '继续添加'
});
//当用户选择图片，加入队列触发
uploader.onFileQueued = function( file ) {
    addFile( file );
    setState( 'ready' );
};
//改变上传状态
function setState( val ) {
    state = val;
    switch ( state ) {
        case 'ready':
            $('.selectbox').addClass( 'element-invisible element-display' );
            $( '#filePicker2,.listbox,.toolbox' ).removeClass( 'element-invisible');
            break;
        case 'uploading':
            $('.upload-btn').text( '暂停上传' );
            break;
        case 'confirm':
            $('.upload-btn').text( '开始上传' );
            break;
        case 'paused':
            $('.upload-btn').text( '继续上传' );
            break;
        case 'cancel':
            $('.selectbox').removeClass( 'element-invisible element-display' );
            $( '#filePicker2,.listbox,.toolbox' ).addClass( 'element-invisible');
            $('.popbox').css("visibility","hidden");
            $(".listbox").empty();
            uploader.reset();
            break;
    }
}
//增加文件
function addFile( file ) {
    var $li = $( '<li id="' + file.id + '">'+
    '<p class="progress"><span></span></p>'+
    '</li>' );
    //生成缩略图
    uploader.makeThumb( file, function( error, ret ) {
        if ( error ) {
            $li.text('预览错误');
        } else {
            $li.prepend('<img alt="" src="' + ret + '" />');
        }
    });
    $(".listbox").append( $li );
};
//出错处理
uploader.on('error', function( type ){
    if(type === 'Q_TYPE_DENIED'){
        alert('文件类型不符合');
    }else if ( type === 'Q_EXCEED_NUM_LIMIT' ) {
        alert('最多允许上传3张图片');
    }else if(type === 'Q_EXCEED_SIZE_LIMIT'){
        alert('文件大小超出');
    }
});
// 点击按钮开始上传
$('.upload-btn').on('click', function() {
    if ( state === 'ready' ) {
        uploader.upload();
    } else if ( state === 'paused' ) {
        uploader.upload();
    } else if ( state === 'uploading' ) {
        uploader.stop();
    }
});
//上传过程进度显示
uploader.onUploadProgress = function( file, percentage ) {
    var li = $('#'+file.id),
    percent = li.find('.progress span');
    percent.css( 'width', percentage * 100 + '%' );
    percent.text(Math.round( percentage * 100 ) + '%');
}
//判断上传结果
uploader.on( 'all', function( type ) {
    console.log('type',type);
    switch( type ) {
        case 'startUpload':
            setState( 'uploading' );
            break;
        case 'stopUpload':
            setState( 'paused' );
            break;
        case 'uploadFinished':
            setState( 'confirm' );
            break;
    }
});
//文件出错返回
uploader.on('uploadError', function(file, reason){
    var li = $('#'+file.id),
    percent = li.find('.progress span');
    percent.css( 'width','100%' );
    percent.text(reason);
    console.log('文件失败');
});
//服务器返回
uploader.on('uploadAccept', function(file, ret){
    console.log('ret',ret);
});
//webuploader End