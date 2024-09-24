// Border param
const DEFAULT_RIGHT_BORDER_MARGIN_LEFT = 0;
const RIGHT_BORDER_MARGIN_LEFT_SPACE_MARGIN = 1.5;
const RIGHT_BORDER_HALF_CHAR_LEFT__MARGIN = 10.3;
const RIGHT_BORDER_HALF_SPACE_LEFT__MARGIN = 6.4;

// id class names
const ID_PWD = '-pwd-';
const ID_IN_CMD = 'in-cmd';
const ID_RIGHT_BORDER = 'right-border';
const CLASS_CMD = 'cmd';
const CLASS_USED_CMD = 'used-cmd';
const CLASS_PWD_TEXT = 'pwd-text';
const CLASS_LS_TEXT = 'ls-text';
const CLASS_LS_TEXT_FOLDER = 'ls-text-folder';
const CLASS_LS_TEXT_FILE = 'ls-text-file';
const CLASS_HISTORY_TEXT = 'history-list';
const CLASS_HISTORY_INDEX = 'history-index';
const CLASS_ERROR_MESSAGE = 'error-message';
const CLASS_HELP_AREA = "help-area";
const CLASS_HELP_HEADER = "help-header";
const CLASS_HELP_LIST = "help-list";
const CLASS_HELP_LINE = "help-line";
const CLASS_HELP_FORMAT = "help-format";
const CLASS_HELP_EXPLAIN = "help-explain";

// ENUM
const ItemType =  Object.freeze({
    text : "file",
    folder : "folder",
    link : "link",
    img : "image",
    err : "error"
});

const MessageType = Object.freeze({
    NFC : "not found command",
    NSF : "no such file",
    NAD : "not a directory",
    CLN : "clean"
});


const RightLeft = Object.freeze({
    right : 1,
    left : -1
});

const UpDown = Object.freeze({
    up : 1,
    down : -1
});

const HelpOption = Object.freeze({
    basic : "Basic",
    all : "All"
});

// messages
const NOT_FOUND_COMMAND_MESSAGE = ": Command  not  found.  Use  'help'  to  see  the  command  list.";
const NO_SUCH_FILE_DIR_MESSAGE = ": No  such  file  or  directory";
const NOT_A_DIRECTORY_MESSAGE = ": Not  a  directory";
const BASIC_HELP_MESSAGE_HEADER = "My Page of  CUI";

// env
const HOME = "";