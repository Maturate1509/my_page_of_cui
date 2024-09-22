const tree_data = {
    "name":"root",
    "type":"folder",
    "children":[
        {
            "name" : "about",
            "type" : "folder", 
            "children": [
                {
                    "name" : "about.txt",
                    "type" : "file",
                    "file" : "about.txt"
                },
                {
                    "name" : "test",
                    "type" : "folder",
                    "children" : []
                }
            ]
        },
        {
            "name" : "attribute",
            "type" : "folder",
            "children" : [
                {
                    "name" : "article01.link",
                    "type" : "link",
                    "link" : "#"
                },
                {
                    "name" : "article02.link",
                    "type" : "link",
                    "link" : "#"
                }
            ]
        },
        {
            "name" : "messages",
            "type" : "folder", 
            "children": [
                {
                    "name" : "readme.md",
                    "type" : "file",
                    "file" : "readme.txt"
                }
            ]
        },
        {
            "name" : "product",
            "type" : "folder",
            "children" : [
                {
                    "name" : "feature01.png",
                    "type" : "image"
                }
            ]
        }
    ]
};

const tempalte_cmd_lists = {
    cmds:[
        {
            name : "cd",
            format : "cd  [dir]",
            explain : "change  directory."
        },
        {
            name : "ls",
            format : "ls",
            explain : "list  segments."
        },
        {
            name : "history",
            format : "history",
            explain : "command  history."
        },
    ]
}

//あらかじめ取ってて問題ない子達
const cui_display = document.getElementById("cui-display");
const load_text = document.getElementById("load-text");
const load_fig = document.getElementById("load-fig");
// const tree_directorys = Object.keys(tree_data);
// let tree_directorys;
// サーバに置く場合は別のロード手段jsonファイルのロード
// fetch('https://github.com/Maturate1509/calorie_cui_copy/blob/main/tree.json')
// .then(response => {
//     return response.json();
// })
// .then(jsonData => {
//     tree_directorys = jsonData; 
// });

//渡すのめんどいグローバル達
let pwd_list = ["root"];   //現在地

//htmlを直書きしたくないけど大人のいろいろな理由から
const root_user_html = "<span class='root-user'>Maturate1509</span>";  
const doller_mark = "<span class='doller'>$</span>";
const text_inner = "<span id='in-cmd' class='cmd'></span>";
const right_border = "<span id='right-border'></span>"
// const text_inner = "<input type=textbox id='in-cmd'></span>";

let cursol_pos = 0; //カーソルの現在地
let upArrow_count = 0; //コマンド坂登の回数
let load_time_count = 1; //初期ロードのカウント

//元となるエレメント
const newContent = document.createElement('span');
newContent.id = ID_PWD;
// newContent.innerHTML = "<span class='root-user'>caloriemateliquid</span> <span class='doller'>$</span> <span id='in-cmd'></span>";
newContent.innerHTML = [root_user_html, doller_mark, text_inner, right_border].join(" ");
const hidden_input_element = document.createElement('input');
hidden_input_element.id = "input-area" ;
const nextLine = document.createElement("br"); //改行

//figの変更
const changeFig = () => {
    //sliceで1つずつ変えてる
    let figure = load_fig.textContent;
    let a = figure.slice(0,load_time_count);
    const b = "/";
    let c = figure.slice(load_time_count+1,figure.length);
    load_fig.textContent = a.concat(b,c);
};

//loadの描画処理
const intervalid = setInterval(() => {
    //30回0.05秒おきに繰り返す
    changeFig();
    load_time_count++;
    if(load_time_count > 30) {
        //インターバルを消去してルートユーザ表示
        clearInterval(intervalid);
        load_text.textContent = "LOADED";
        cui_display.appendChild(newContent.cloneNode(true));
        document.getElementById(ID_IN_CMD).appendChild(hidden_input_element);
    }
}, 50);

//待機状態の縦棒表示
// const waitTimeBar = setInterval(() => {
//     var allcmd = document.getElementsById('in-cmd');
//     if (allcmd.className == "view-bar") {
//         allcmd.
//     }
//     else {

//     }
    
// });

//入力がコマンドに反映
const newInputCmd = (inKey) => {
    // 現在のカーソルの位置の間に入れる
    // 文字によって大きさが違う?
    const allcmd_element = document.getElementById(ID_IN_CMD);
    already_incmd = allcmd_element.textContent;
    const text_length = already_incmd.length; 
    let pos = text_length + cursol_pos;
    let a = already_incmd.slice(0,pos);
    let c = already_incmd.slice(pos,text_length);
    
    allcmd_element.textContent = a + inKey + c;
};

//特殊キーの分割
const pushedSpecialKey = (specialKey) => {
    switch(specialKey) {
        //Enterキー
        case "Enter":
            pushedEnter();
            break;
        //Tabキー
        case "Tab":
            pushedTab();
            break;
        case "Backspace":
            pushedBackspace();
            break;
        case "ArrowUp":
            pushedArrowR(UpDown.up);
            break;
        case "ArrowDown":
            pushedArrowR(UpDown.down);
            break;
        case "ArrowRight":
            pushedArrowM(RightLeft.right);
            break;
        case "ArrowLeft":
            pushedArrowM(RightLeft.left);
            break;
        default:
            //何もしない 
    }
};

//tabの時の処理
const pushedTab = () => {
    // let in_cmd_text = document.getElementById(ID_IN_CMD).textContent;
    let in_cmd_text = hidden_input_element.value;
    let in_cmds = in_cmd_text.split(" ");
    let dir_cmd_index = 1; // オプションが付くようになったときのために
    // if( in_cmds.length < 2 || in_cmds[dir_cmd_index] == "" ) {
    if( in_cmds.length < 2 ) {
        return;
    }
    // カレント配下にあるファイルフォルダを取得
    // cd checkからのtab候補
    let paths = in_cmds[dir_cmd_index].split('/');
    const cleaned_path = cleanPath(paths);
    let tmp_pwd_list = pwd_list.filter( (_,index) => index !== -1 );

    // 現在入力してあるパスが存在しているかの確認
    for(let i = 0; i < cleaned_path.length -1; i++) {
        const change_result = changeDirProcess( tmp_pwd_list, cleaned_path[i] );
        if( change_result[0] == false ) {
            return;
        }
    }
    const regexp = new RegExp("^"+cleaned_path[cleaned_path.length-1]);
    let now_ls = GetElementListIncludes(tree_data,tmp_pwd_list);
    let filtered_now_ls = now_ls.filter( (v) => regexp.test(v.name) );

    // 候補無し
    if( filtered_now_ls.length == 0 ) {
        return;
    }
    // 候補が1つに定まる
    else if( filtered_now_ls.length == 1 ) {
        // 候補に置き換える
        paths[paths.length-1] = filtered_now_ls[0].name;
        in_cmds[dir_cmd_index] = paths.join("/");
        const join_contents = in_cmds.join(" ");
        // document.getElementById(ID_IN_CMD).textContent = join_contents;
        hidden_input_element.value = join_contents;
    }
    // 複数候補
    else {
        //前の状態をコピー
        const pwd_element = document.getElementById(ID_PWD).cloneNode(true);
        // いつもの
        fixedPhrase();
        clear_cmd_text(pwd_element);

        // コマンドは残しておく
        hidden_input_element.value = in_cmd_text;

        cui_display.appendChild(nextLine.cloneNode(true));
        out_ls_result(filtered_now_ls);
        cui_display.appendChild(nextLine.cloneNode(true));
        cui_display.appendChild(pwd_element);
        document.getElementById(ID_IN_CMD).appendChild(hidden_input_element);
    }
    
};

//enterの時の処理
const pushedEnter = () => {
    // let cmd_element = document.getElementById(ID_IN_CMD);
    // cmdProcess(cmd_element.textContent);
    let cmd_element = document.getElementById("input-area");
    cmdProcess(cmd_element.value);
    cursol_pos = 0;
    upArrow_count = 0;
};

//backspaceの処理
const pushedBackspace = () => {
    //replaceで消している
    let cmd_txt = document.getElementById(ID_IN_CMD).textContent;
    let pos = cmd_txt.length + cursol_pos;
    
    //カーソルが先頭行にいる場合なにもしない 
    if( pos == 0 ) {
        return;
    }

    let txtLength = cmd_txt.length;
    let a = cmd_txt.slice(0,pos-1);
    let c = cmd_txt.slice(pos,txtLength);

    document.getElementById(ID_IN_CMD).textContent = a+c;
};

const pushedArrowM = ( direction ) => {
    let next_cursol_pos = cursol_pos + direction;
    const now_all_cmd_text = document.getElementById(ID_IN_CMD).textContent;
    // コマンドの範囲外になる場合何もしない
    if( Math.abs(next_cursol_pos) > now_all_cmd_text.length || next_cursol_pos > 0 ) {
        return;
    }

    cursol_pos = next_cursol_pos;

    // カーソルの位置が変更になるため
    // rightBorderReset();
}


const pushedArrowR = ( direction ) => {
    let next_upArrow_count = upArrow_count + direction;
    const used_cmd_elements = document.getElementsByClassName(CLASS_USED_CMD);
    const used_cmd_cleaned_text = getTextOfHTMLCollection(used_cmd_elements);

    const number_of_used_cmd = used_cmd_cleaned_text.length;
    if( number_of_used_cmd >= next_upArrow_count && next_upArrow_count >= 0 ) {
        upArrow_count = next_upArrow_count;
    }

    let set_cmd = ""; // 変更後0の場合は空とする
    if( upArrow_count > 0 ) {
        set_cmd = used_cmd_cleaned_text[number_of_used_cmd - upArrow_count ];
    }

    document.getElementById(ID_IN_CMD).textContent = set_cmd;

    // コマンド自体が変更となるため
    cursol_pos = 0;
    // rightBorderReset();
}

//コマンド処理
const cmdProcess = (cmd_text) => {
    switch(true) {
        case /^cd/.test(cmd_text):
            changeDir(cmd_text);
            break;
        case /^pwd/.test(cmd_text):
            printWorkingDir(cmd_text);
            break;
        case /^ls/.test(cmd_text):
            listSeg(cmd_text);
            break;
        case /^history/.test(cmd_text):
            printCmdHistory(cmd_text);
            break;
        case /^help/.test(cmd_text):
            printCmdList(cmd_text);
            break;
        default:
            not_found_proc(cmd_text);
    }
    
};

//新しく行移動するときの定型文
const fixedPhrase = () => {
    //id:in-cmd,-pwd-を取り除きin-cmdが付いていた方にused-cmdを渡す
    let cmd_element = document.getElementById(ID_IN_CMD);
    let pwd_element = document.getElementById(ID_PWD);
    let right_border_element = document.getElementById(ID_RIGHT_BORDER);
    let old_input_area = document.getElementById('input-area');
    cmd_element.removeChild(old_input_area);
    cmd_element.classList.add(CLASS_USED_CMD);
    cmd_element.removeAttribute('id');
    pwd_element.removeAttribute('id');
    right_border_element.removeAttribute('id');

    cmd_element.textContent = old_input_area.value;
    hidden_input_element.value = "";
};

// borderのリセット
const rightBorderReset = () => {
    // spaceだけ余白が生まれないため余白を作る
    const now_all_cmd_text = document.getElementById(ID_IN_CMD).textContent;
    const all_cmd_length = now_all_cmd_text.length;
    const right_border_element = document.getElementById(ID_RIGHT_BORDER);

    let left_margin = DEFAULT_RIGHT_BORDER_MARGIN_LEFT;
    // postion調整
    if( cursol_pos != 0 ) {
        // 後ろからの長さ分カーソルを移動させる
        const cmd_of_SelectedtoEnd = now_all_cmd_text.slice( all_cmd_length+cursol_pos, all_cmd_length );
        const font = document.getElementById(ID_IN_CMD).style.font;
        const cmd_width_SelectedtoEnd = measureTextWidth(cmd_of_SelectedtoEnd, font);
        left_margin += cmd_width_SelectedtoEnd*-1;
    }
    right_border_element.style.marginLeft = left_margin+"px";
}

// 行追加後処理
const endPhase = () => {
    // スクロールを一番下へ
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);

    document.getElementById("input-area").focus();
}

//cdコマンド
const changeDir = (cmd_text) => {
    const nowProc = "cd";
    //前の状態をコピー
    let pwd_element = document.getElementById(ID_PWD).cloneNode(true);
    // usage用のbackup
    let bk_pwd_list = structuredClone(pwd_list);
    fixedPhrase();
    //cd の後ろを取得と取り除き
    let cmd_path = cmd_text.replace(/^cd\s*/, "");
    let changedContent = pwd_element;
    clear_cmd_text(changedContent);

    let paths = cmd_path.split('/');
    const cleaned_path = cleanPath(paths);
    
    // forで一つずつ処理していく
    for( let i in cleaned_path ) {
        // pwd_listの更新を行う
        const change_result = changeDirProcess( pwd_list, cleaned_path[i] );
        if( change_result[0] == false ) {
            let out_path = "";
            if( change_result[1] == MessageType.NAD ) {
                out_path = paths[i];
            }
            else if( change_result[1] == MessageType.NSF ) {
                out_path = paths.slice(0,Number(i)+1).join('/');
                
            }
            pwd_list = bk_pwd_list;
            out_usage(nowProc, change_result[1], out_path);
            break;
        }
    }
    
    let in_dir = "";
    if( pwd_list.length !== 1 ) {
        in_dir = pwd_list[ pwd_list.length -1 ]; 
    }
    const inhtml = "<span class='adapt-dir'>" + in_dir + "</span>";
    changedContent.innerHTML = [root_user_html,inhtml , doller_mark, text_inner, right_border].join(" ");

    cui_display.appendChild(nextLine.cloneNode(true));
    cui_display.appendChild(changedContent);
    document.getElementById(ID_IN_CMD).appendChild(hidden_input_element);
};

//pwdコマンド
const printWorkingDir = (cmd_text) => {
    //前の状態の保存
    const pwd_element = document.getElementById(ID_PWD).cloneNode(true);
    //いつもの
    fixedPhrase();
    clear_cmd_text(pwd_element);
    
    //pwd_listを/でつないだものを表示させる
    pwd_text = pwd_list.join("/");
    const pwd_print_element = document.createElement('span');
    pwd_print_element.textContent = pwd_text;
    pwd_print_element.classList.add(CLASS_PWD_TEXT);
    cui_display.appendChild(nextLine.cloneNode(true));
    cui_display.appendChild(pwd_print_element);
    cui_display.appendChild(nextLine.cloneNode(true));
    cui_display.appendChild(pwd_element);
    document.getElementById(ID_IN_CMD).appendChild(hidden_input_element);
};

//lsコマンド
const listSeg = (cmd_text) => {
    //前の状態のコピー
    const pwd_element = document.getElementById(ID_PWD).cloneNode(true);
    
    // let objects_list = []; //表示するオブジェクト保存用
    //いつもの
    fixedPhrase();
    clear_cmd_text(pwd_element);
    cui_display.appendChild(nextLine.cloneNode(true));

    let objects_list = GetElementListIncludes(tree_data,pwd_list);

    out_ls_result(objects_list);
    
    // ls の結果が1件以上の場合改行を行う
    if( objects_list.length > 0 ) {
        cui_display.appendChild(nextLine.cloneNode(true));
    }
    cui_display.appendChild(pwd_element);
    document.getElementById(ID_IN_CMD).appendChild(hidden_input_element);
};

//historyコマンド
const printCmdHistory = (cmd_text) => {
    //前の状態をコピー
    const pwd_element = document.getElementById(ID_PWD).cloneNode(true);
    //used-cmdクラスを持つ要素を取得
    const used_cmd_elements = document.getElementsByClassName(CLASS_USED_CMD);
    const used_cmd_cleaned_text = getTextOfHTMLCollection(used_cmd_elements);
    //いつもの
    fixedPhrase();
    clear_cmd_text(pwd_element);
    //liエレメント作成,history-listクラス付与
    const used_cmds_list_element = document.createElement('ul');
    used_cmds_list_element.classList.add(CLASS_HISTORY_TEXT);

    //used-cmdを一つずつulに追加していく
    for(var index = 0; index < used_cmd_cleaned_text.length; index++) {

        //liタグ作成
        var used_cmd_element = document.createElement('li');
        //インデックス番号用span作成,history-indexクラス付与
        var index_span_element = document.createElement('span');
        index_span_element.classList.add(CLASS_HISTORY_INDEX);
        index_span_element.textContent = index;
        //使用後コマンド表示用span
        var used_cmd_text_element = document.createElement('span');
        used_cmd_text_element.textContent = used_cmd_cleaned_text[index];
        //liタグに追加
        used_cmd_element.appendChild(index_span_element);
        used_cmd_element.appendChild(used_cmd_text_element);
        //ulタグに追加
        used_cmds_list_element.appendChild(used_cmd_element);
        
    }

    //cui_displayに表示
    cui_display.appendChild(nextLine.cloneNode(true));
    cui_display.appendChild(used_cmds_list_element);
    cui_display.appendChild(pwd_element);
    document.getElementById(ID_IN_CMD).appendChild(hidden_input_element);
};

// 使用可能のcmd を表示する
const printCmdList = (cmd_text) => {
    //前の状態をコピー
    const pwd_element = document.getElementById(ID_PWD).cloneNode(true);
    //いつもの
    fixedPhrase();
    clear_cmd_text(pwd_element);

    const help_cmds_area_element = document.createElement('div');
    help_cmds_area_element.classList.add(CLASS_HELP_AREA);

    let help_cmd_header_top_element = document.createElement('p');
    // help_cmd_header_top_element.classList.add(CLASS_HELP_HEADER);
    help_cmd_header_top_element.textContent = BASIC_HELP_MESSAGE_HEADER;

    let help_cmd_header_bot_element = document.createElement('p');
    help_cmd_header_bot_element.classList.add(CLASS_HELP_HEADER);
    help_cmd_header_bot_element.textContent = HelpOption.basic + " commands";

    help_cmds_area_element.appendChild(help_cmd_header_top_element);
    help_cmds_area_element.appendChild(help_cmd_header_bot_element);
    //liエレメント作成,history-listクラス付与
    const help_cmds_list_element = document.createElement('ul');
    help_cmds_list_element.classList.add(CLASS_HELP_LIST);
    help_cmds_area_element.appendChild(help_cmds_list_element);

    //cmd_listを一つずつulに追加していく
    for(var index = 0; index < tempalte_cmd_lists.cmds.length; index++) {
        //liタグ作成
        var help_cmd_element = document.createElement('li');
        //コマンドリスト表示用dl
        var help_cmd_line_element = document.createElement('dl');
        help_cmd_line_element.classList.add(CLASS_HELP_LINE);
        var help_cmd_format_element = document.createElement('dt');
        help_cmd_format_element.textContent = tempalte_cmd_lists.cmds[index].format;
        help_cmd_format_element.classList.add(CLASS_HELP_FORMAT);
        var help_cmd_explain_element = document.createElement('dd');
        help_cmd_explain_element.textContent = ": " + tempalte_cmd_lists.cmds[index].explain;
        help_cmd_explain_element.classList.add(CLASS_HELP_EXPLAIN);
        //liタグに追加
        help_cmd_line_element.appendChild(help_cmd_format_element);
        help_cmd_line_element.appendChild(help_cmd_explain_element);
        help_cmd_element.appendChild(help_cmd_line_element);
        //ulタグに追加
        help_cmds_list_element.appendChild(help_cmd_element);
    }

    //cui_displayに表示
    cui_display.appendChild(nextLine.cloneNode(true));
    cui_display.appendChild(help_cmds_area_element);
    cui_display.appendChild(pwd_element);
    document.getElementById(ID_IN_CMD).appendChild(hidden_input_element);
};

//not found処理
const not_found_proc = (cmd_text) => {
    const pwd_element = document.getElementById(ID_PWD).cloneNode(true);
    // いつもの
    fixedPhrase();
    clear_cmd_text(pwd_element);

    // 空文字でない場合not foundを出す
    if( cmd_text != "" ) {
        out_usage(cmd_text,MessageType.NFC,"");
    }
    //コピーしないで追加していくと変更後の値になる
    cui_display.appendChild(nextLine.cloneNode(true));
    cui_display.appendChild(pwd_element.cloneNode(true));
    document.getElementById(ID_IN_CMD).appendChild(hidden_input_element);
};

// Usage出力
const out_usage = (main_cmd, messageType, sub_cmd) => {
    let message = "";
    switch(messageType) {
        case MessageType.NFC:
            message = main_cmd + NOT_FOUND_COMMAND_MESSAGE;
            break;
        case MessageType.NSF:
            message = main_cmd+":  "+sub_cmd+ NO_SUCH_FILE_DIR_MESSAGE;
            break;
        case MessageType.NAD:
            message = main_cmd+":  "+sub_cmd+ NOT_A_DIRECTORY_MESSAGE;
        default:
    }

    let error_message_element = document.createElement('span');
    error_message_element.classList.add(CLASS_ERROR_MESSAGE);
    error_message_element.textContent = message;
    cui_display.appendChild(nextLine.cloneNode(true));
    cui_display.appendChild(error_message_element);
}

// ls 表示
const out_ls_result = ( objects_list ) => {
    //1つずつcui_displayに表示していく
    for(var obj_index in objects_list) {
        var ls_print_element = document.createElement('span');
        ls_print_element.textContent = objects_list[obj_index].name;
        ls_print_element.classList.add(CLASS_LS_TEXT);
        if( objects_list[obj_index].type == ItemType.folder ) {
            ls_print_element.classList.add(CLASS_LS_TEXT_FOLDER);
        }
        // else if( objects_list[obj_index].type == ItemType.text ) {
        //     ls_print_element.classList.add(CLASS_LS_TEXT_FILE);
        // }
        else {
            ls_print_element.classList.add(CLASS_LS_TEXT_FILE);
        }

        // 4つ毎に改行をする
        if( obj_index != 0 && obj_index % 4 == 0 ) {
            cui_display.appendChild(nextLine.cloneNode(true));
        }
        cui_display.appendChild(ls_print_element);
    }
}

// 設定されているコマンド部分+コピーされたinputを消す
const clear_cmd_text = (pwd_element) => {
    let cmd_classes_element = pwd_element.getElementsByClassName(CLASS_CMD);
    let cmd_class_element = cmd_classes_element[cmd_classes_element.length -1];
    cmd_class_element.textContent = "";
}

//コマンド入力
document.onkeydown = function(ev) {
    let input_key = ev.key;
    //特殊キーの処理
    if (input_key.length >= 2 ) {
        if(ev.key === "Tab" ) {
            // これをしないとフォーカスがデフォルトの挙動(勝手に移動)する
            ev.preventDefault();
        }
        pushedSpecialKey(input_key);
    }
    //一般的なキー
    else {
        // newInputCmd(input_key);
    }
    // rightBorderReset();
    endPhase();
};

//html読み込み後の処理
window.addEventListener("load",function() {
    intervalid;
    
});

cui_display.onclick = function() {;
    document.getElementById("input-area").focus();
};

hidden_input_element.addEventListener("keydown", (e) => {
    // if ( e.key.includes("ArrowUp", "ArrowDown") == true ) {
    if ( ["ArrowUp", "ArrowDown"].includes(e.key) == true ) {
        e.preventDefault();
    }
});

hidden_input_element.addEventListener("keyup", (e) => {
    hidden_input_element.style.width = measureTextWidth( hidden_input_element.value,hidden_input_element.style.font ) + "px";
});