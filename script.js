//変数同士を「,」で区切ると同時に複数の変数を定義できる
// 各パーツの情報を変数に格納する

const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateBtn = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-image img"),
resetBtn = document.querySelector(".reset-filter"),
chooseBtn = document.querySelector(".choose-img"),
saveBtn = document.querySelector(".save-img");

//デフォルトの数値の定義
let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
let rotate = 0, flipHorizontal = 1 , flipVertical = 1;


//lordImage =ファイル読み込みの関数
const lordImage = function(){
    let file = fileInput.files[0];                          //ノードのファイルリスト内の最初のファイルを File オブジェクトとして取得する
    if(!file) return;                                       //ファイルが0じゃなかったら
    previewImg.src = URL.createObjectURL(file);             //引数で指定されたオブジェクトを表す URL を含む DOMString を生成
    previewImg.addEventListener("load",function(){
        resetBtn.click();//リセットボタンのマウスクリックをシミュレート
        document.querySelector(".container").classList.remove("disable")//disableクラスを削除
    });
}

//setFilter =スタイルを書き換える関数
const setFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

//forEach()メソッドで各オプションのテキストを書き換えてバー上に表示
filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;
        //if文で触っているバーの値変更
        if(option.id === "brightness") {
            filterSlider.value = brightness;
            filterSlider.max = "200";
            filterValue.innerText = `${brightness}%`;
        } else if(option.id === "saturation") {
            filterSlider.value = saturation;
            filterSlider.max = "200";
            filterValue.innerText = `${saturation}%`
        } else if(option.id === "inversion") {
            filterSlider.value = inversion;
            filterSlider.max = "100";
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.value = grayscale;
            filterSlider.max = "100";
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

//フィルターの値を書き換える
function updateFilter(){
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    setFilter();

}

rotateBtn.forEach(option => {
    option.addEventListener("click", () => {
        if(option.id === "left") {
            rotate -= 90;
        } else if(option.id === "right") {
            rotate += 90;
        } else if(option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        setFilter();
    });
});
//horizontalが90degの時にどうやって高さ取得したらいいの…


//各値をDefaultにセットし直す
const resetFilter  = function(){
    brightness = "100";
    saturation = "100";
    inversion = "0";
    grayscale = "0";
    rotate = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    filterOptions[0].click();//輝度にする
    setFilter();
}

//画像を描画して保存する
const saveImage = function(){
    const canvas = document.createElement("canvas");//canvasを生成
    const context = canvas.getContext("2d");//描画させるやつ
    canvas.width = previewImg.naturalWidth //naturalWidthで元画像の横幅にする
    canvas.height = previewImg.naturalHeight //naturalWidthで元画像の縦幅にする
    
    context.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`; //filterプロパティー
    context.translate(canvas.width / 2, canvas.height / 2);
    
    if(rotate !== 0) {
        context.rotate(rotate * Math.PI / 180);
    }
    context.scale(flipHorizontal, flipVertical);
    // drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
    context.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    //保存
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();

}

resetBtn.addEventListener("click", resetFilter);
saveBtn.addEventListener("click", saveImage);
filterSlider.addEventListener("input", updateFilter);
fileInput.addEventListener("change", lordImage);
chooseBtn.addEventListener("click", () => fileInput.click());
