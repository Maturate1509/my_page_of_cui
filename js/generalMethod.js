// treeから指定された箇所にあるデータのリストを取得する
const GetElementListIncludes = (tree,list) => {
    let array = [];
    let copy_list = list.filter((_, index) => index !== 0 );
    const GetElement = (tree) => {
        // current directoryまで移動
        if( copy_list.length != 0 ) {
            const pos = copy_list.shift();
            let not_folder = true;
            for( let i in tree.children ) {
                if( tree.children[i].type == ItemType.folder && tree.children[i].name == pos ) {
                    GetElement( tree.children[i] );
                    not_folder = false;
                    break;
                } 
            }
            if( not_folder == true ) {
                array.push({"type":ItemType.err,"name":"-"});
            }
            
        }
        //移動完了後
        else {
            for( i in tree.children ) {
                array.push({"type":tree.children[i].type, "name":tree.children[i].name});
            }
        }
    }
    GetElement(tree);
    return array;
}

// 文字列のwidthの計測を行う
const measureTextWidth = (text, font, letterSpacing="1px") => {
    const tmp_span = document.createElement("span");
    tmp_span.style.visibility = "hidden";
    tmp_span.style.whiteSpace = "pre-wrap";
    tmp_span.style.padding = 0;
    tmp_span.style.margin = 0;
    tmp_span.style.border = 0;
    tmp_span.style.color = "white";
    tmp_span.style.letterSpacing = letterSpacing;

    tmp_span.style.font = font;
    tmp_span.textContent = text;
    document.body.appendChild(tmp_span);
    const width = tmp_span.getBoundingClientRect().width;
    
    document.body.removeChild(tmp_span);

    return width;
}

// HTMLcollectionからtextを取得する
const getTextOfHTMLCollection = ( list, needEmpty = false ) => {
    let result = [];
    for( var i = 0; i < list.length; i++ ) {
        if( list[i].textContent != "" || needEmpty == true ) {
            result.push( list[i].textContent );
        }
    }

    return result;
}

// pathsを単純な物にする
const cleanPath = ( paths ) => {
    let result = [];
    const lost_space_frontBack_paths = paths.map( path => path.replace(/^\s* | \s*$/g, "") );
    
    for( var i in lost_space_frontBack_paths ) {

        if( lost_space_frontBack_paths[i] == "" ) {
            // ルートディレクトリから開始のパターン
            if( paths.length >= 2 && i == 0 ) {
                result.push("/");
            }
            // 空白のみの場合 「..」と同じ処理
            else if( paths.length == 1 ) {
                result.push("..");
            }
            else {
                result.push("");
            }
            continue;
        }

        result.push( lost_space_frontBack_paths[i] );
    }

    return result;
}

// pwdの下に引数のフォルダ名が存在しているか確認
const checkExistsDir = ( pwd_fol, dir_name ) => {

    const check = ( dir_list, dir_name ) => {
        for( var j in dir_list ) {
            
            if( dir_list[j].name == dir_name ) {
                // 見つかった場合
                if( dir_list[j].type == ItemType.folder ) {
                    return [true, MessageType.CLN];
                }
                return [false, MessageType.NAD];
            }
        }

        return [false, MessageType.NSF];
    }

    const list = GetElementListIncludes(tree_data, pwd_fol);
    const result = check( list, dir_name );

    return result;
}

// 移動可能な場合 in_pwd_listに変更を加える
const changeDirProcess = ( in_pwd_list, change_path ) => {
    // 空文字
    if( change_path == "" ) {
        // なにもしない
    }
    // ルートディレクトリへ
    else if( change_path == "/" ) {
        in_pwd_list.splice(1, in_pwd_list.length-1 );
    }
    // 階層を上がる
    else if( change_path == ".."  ) {
        if( in_pwd_list.length >= 2 ) {
            in_pwd_list.pop();
        }
    }
    // 階層を下る
    else {
        //　フォルダの存在チェック
        const exists_result  = checkExistsDir( in_pwd_list, change_path );
        // 正常ケース
        if ( exists_result[0] == true ) {
            in_pwd_list.push(change_path);
        }
        // 例外ケース
        else {
            return exists_result
        }
    }
    
    return [true, MessageType.CLN];
};