/**
 * Created by qiangxl on 2019/4/14.
 */
const lookPic =  (options, imgOptions) => {
  options.on('change', function () {
    console.log(options);
    previewImage(options[0])
  });

  function previewImage(file) {
    if (file.files && file.files[0]) {
      let reader = new FileReader()
      //读取为dataURL格式
      reader.readAsDataURL(file.files[0])
      //读取完成时
      reader.onload = function (evt) {
        imgOptions.attr({'src': evt.target.result})
      }
    }
  }
}

export default lookPic