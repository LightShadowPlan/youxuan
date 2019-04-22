/**
 * Created by qiangxl on 2019/4/14.
 */
const lookPic = (options, imgOptions, array) => {
  let photoNum
  options.on('change', function () {
    previewImage(options[0], imgOptions, array)
    photoNum = options[0].files.length
    return photoNum
  });

  function previewImage(file, imgOptions, array) {
    if (array) {
      if (file.files.length > 0) {
        for (let i = 0; i < file.files.length; i++) {
          imgOptions[i].attr({'src': ''})
          let reader = new FileReader()
          //读取为dataURL格式
          reader.readAsDataURL(file.files[i])
          //读取完成时
          reader.onload = function (evt) {
            imgOptions[i].attr({'src': evt.target.result})
          }
        }
      }
    } else {
      if (file.files.length > 0) {
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
}

export default lookPic