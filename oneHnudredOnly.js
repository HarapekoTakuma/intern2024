/**
 * cracker.js
 * aaa
*/

/**
 * 要素追加、値の設定、イベントリスナを設定します
 */
document.addEventListener("DOMContentLoaded", function () {
    const numberGrid = document.getElementById("number-grid");
    const anserButton = document.getElementById("anser-btn");
    const newbtn = document.getElementById("new-btn");


    // 二桁の数字 65 ～ 10 で重複しない適当な値を作ってみる
    const keyArray = createkeyValue(10, 65, 12);

    for (let i = 0; i < keyArray.length; i ++) {
        const newKey = document.createElement("div");
        newKey.id = `cell-${i}`;
        newKey.className = "key";
        newKey.textContent = keyArray[i];
        newKey.addEventListener('click',  () => choice(newKey, 3));

        numberGrid.appendChild(newKey);
    }

    // 数字を変えてみよう！ボタンに、クリックイベントを登録
    newbtn.addEventListener('click', changed);

    // 計算してみよう！ボタンに、クリックイベントを登録
    anserButton.addEventListener('click',  () =>  checked(100));
} );

/**
 * 選ばれた要素に choice を設定したり外したりします
 * アローにしないとパラメタ渡すのが大変そう（handleEvent を使うらしいがよくわからなかった）
 * @param {*} element イベントが発生した要素
 * @param {*} maxSelectCnt 最大選択件数
 * @returns 
 */
function choice(element, maxSelectCnt) {

    // cracker-container配下のchoiceが設定されている要素を取ります
    // これを書いてて思ったことは、number-gridなくてもいける気がする
    // querySelectorAll(`.cracker-container>choice`) こう書きたいんだけど。
    const selected = document.querySelectorAll(`.cracker-container .choice`);

    if(!element.classList.contains("choice")) {
        // 3つ以上選択されていれば、選択させない
        if (selected.length >= maxSelectCnt) {
            return;
        }
        element.classList.add("choice");
    } else {
        element.classList.remove("choice")
    }
}

/**
 * 数字を変えます。
 * ・number-grid配下にある要素を全部消します。
 * ・もう一回div要素を作り直します
 */
function changed() {

    let numberGrid = document.getElementById("number-grid");
    while (numberGrid.firstChild) {
        numberGrid.removeChild(numberGrid.firstChild);
    }

    // 二桁の数字 10 ~ 65 の間で重複しないランダム値を作ってみる
    const keyArray = createkeyValue(10, 65, 12);

    for (let i = 0; i < keyArray.length; i ++) {
        const newKey = document.createElement("div");
        newKey.id = `cell-${i}`;
        newKey.className = "key";
        newKey.textContent = keyArray[i];
        newKey.addEventListener('click',  () => choice(newKey, 3));

        numberGrid.appendChild(newKey);
    }
}

/**
 * choice の classを持つアイテムの数値を合算し、wantNumberと同じ値か確認します。
 * wantNumberと同じだったら褒めます
 * 3つ選ばれていなければ注意します。
 * @returns 
 */
function checked(wantNumber) {

    const checkedItems = document.querySelectorAll(`.cracker-container .choice`);

    if (checkedItems.length != 3) {
        alert("３つえらんでね");
        return;
    }

    let total = 0;
    checkedItems.forEach((items) => {
        total += parseInt(items.textContent);
    });
    
    if (total != wantNumber) {
        alert(total + "です。残念はずれ！");
        return;
    } 
    alert("正解です！すごっ");
}

/*
 * カギとなる値を発行します。
 *  一度発行した値は発行しません
 * 
 * 　min:最小値
 * 　max:最大値
 *   required:発行する数、
 * 
 * @param {*} min 
 * @param {*} max 
 * @param {*} required 
 * @returns 
 */
function createkeyValue(min, max, required) {

    let keyArray = new Array();

    // 無限ループやだお
    let loopbreak = true;
    while (loopbreak) {

        while (keyArray.length < required) {
            // こーれややこしい
            // Math.random() は  0 以上 1 未満の値を戻します、、ってことなので
            // 1 - 100 までの値を取りたいとすると例えば
            // 0.61XXX... × (100 - 1 + 1)　= 61.xxxx が取れます
            // Math.floor は関数は与えられた数値以下の最大の整数を返します、、ってことなので
            // 61.xxxxの少数を含む値は61になります。
            let keyValue = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!keyArray.includes(keyValue)) {
                keyArray.push(keyValue);
            }
        }

        // 作成された keyArray の中で、３つ足して100になる組み合わせがあるか検証します。
        // この作りは非常にダサい。これどうにかしたい。フォフォフォて。
        // 選べる値を4つにしたい時とか終わるし。
        // 一次元配列で考えるからしんどい気がする。どうしたものか。
        let correctAnswer = 0;
        for (let i = 0; i < required-2; i++) {
            for(let y = i + 1; y < required-1; y++) { 
                for(let z = y + 1; z < required; z++) { 
                   if (100 == (keyArray[i] + keyArray[y] + keyArray[z])) {
                     correctAnswer += 1;
                   }
                }
            }
        }
 
        // 100になる組み合わせが 1組だけか確認します
        if (1 == correctAnswer) {
            loopbreak = false;
        } else {
            // やり直します。
            keyArray = new Array();
        }
    }
    return keyArray;
}
