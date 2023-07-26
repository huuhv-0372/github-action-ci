GKC_HASHCODE_CONFIG_FILE="gkc_hashcode_config.yml"
YAML_PREFIX_PATTERN="config_"
GKC_ADD_FILES="result.txt"

red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`

HTML_COMMENT_START="<!--"
HTML_COMMENT_END="-->"

process_config_file_before_parse() {
    while IFS="" read -r line || [ -n "$line" ]
    do
        if [[ $line == *"${HTML_COMMENT_START_SPACE}"* && $line == *"${HTML_COMMENT_END}"* ]]
        then
            local new_html_cmt="${line//$HTML_COMMENT_START /$HTML_COMMENT_START}"
            local new_html_cmt="${new_html_cmt// $HTML_COMMENT_END/$HTML_COMMENT_END}"
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s/$line/$new_html_cmt/" $GKC_HASHCODE_CONFIG_FILE
            else
                sed -i "s/$line/$new_html_cmt/" $GKC_HASHCODE_CONFIG_FILE
            fi
        fi
    done < $GKC_HASHCODE_CONFIG_FILE
}

process_config_file_after_parse() {
    while IFS="" read -r line || [ -n "$line" ]
    do
        if [[ $line == *"${HTML_COMMENT_START}"* && $line == *"${HTML_COMMENT_END}"* ]]
        then
            local new_html_cmt="${line//$HTML_COMMENT_START%/$HTML_COMMENT_START %}"
            local new_html_cmt="${new_html_cmt//$HTML_COMMENT_END/ $HTML_COMMENT_END}"
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s/$line/$new_html_cmt/" $GKC_HASHCODE_CONFIG_FILE
            else
                sed -i "s/$line/$new_html_cmt/" $GKC_HASHCODE_CONFIG_FILE
            fi
        fi
    done < $GKC_HASHCODE_CONFIG_FILE
}

process_config_file_before_parse

parse_yaml() {
    local s
    local w
    local fs

    s='[[:space:]]*'
    w='[a-zA-Z0-9_.-]*'
    fs="$(echo @|tr @ '\034')"

    (
        sed -e '/- [^\“]'"[^\']"'.*: /s|\([ ]*\)- \([[:space:]]*\)|\1-\'$'\n''  \1\2|g' |

        sed -ne '/^--/s|--||g; s|\"|\\\"|g; s/[[:space:]]*$//g;' \
            -e "/#.*[\"\']/!s| #.*||g; /^#/s|#.*||g;" \
            -e "s|^\($s\)\($w\)$s:$s\"\(.*\)\"$s\$|\1$fs\2$fs\3|p" \
            -e "s|^\($s\)\($w\)${s}[:-]$s\(.*\)$s\$|\1$fs\2$fs\3|p" |

        awk -F"$fs" '{
            indent = length($1)/2;
            if (length($2) == 0) { conj[indent]="+";} else {conj[indent]="";}
            vname[indent] = $2;
            for (i in vname) {if (i > indent) {delete vname[i]}}
                if (length($3) > 0) {
                    vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
                    printf("%s%s%s%s=(\"%s\")\n", "'"$YAML_PREFIX_PATTERN"'",vn, $2, conj[indent-1],$3);
                }
            }' |

        sed -e 's/_=/+=/g' |

        awk 'BEGIN {
                FS="=";
                OFS="="
            }
            /(-|\.).*=/ {
                gsub("-|\\.", "_", $1)
            }
            { print }'
    ) < "$GKC_HASHCODE_CONFIG_FILE"
}

eval "$(parse_yaml)"

get_gkc_version() {
    GKC_HASHCODE_VERSION=$config_versions
}

get_gkc_folder_path() {
    GKC_HASHCODE_FOLDER_PATH=$config_folder_path
}

get_gkc_apply_languages() {
    GKC_APPLY_LANGUAGES=("${config_apply_languages[@]}")
}

get_gkc_apply_extensions() {
    local extentions=""
    for element in "${config_apply_languages[@]}"
    do
        local empty_string=""
        local ext_variable="config_languages_setting_${element}_ext"
        local ext="${!ext_variable//./$empty_string}"
        if [ -z "$extentions" ]
        then
            extentions+="${ext}"
        else
            extentions+="|${ext}"
        fi
    done
    GKC_SUPPORT_EXTENTIONS="${extentions//\"|\"/|}"
    GKC_SUPPORT_EXTENTIONS="${GKC_SUPPORT_EXTENTIONS//\"/}"
}

get_gkc_hash_code_prefix() {
    GKC_HASHCODE_PREFIX="${config_hash_code_prefix//\"/}"
}

get_gkc_hash_code() {
    GKC_HASHCODE="${config_hash_code//\"/}"
}

get_gkc_version
get_gkc_folder_path
get_gkc_apply_languages
get_gkc_apply_extensions
get_gkc_hash_code_prefix
get_gkc_hash_code

add_gkc_comment_format() {
    local empty_string=""
    local FILENAME=$1

    for element in "${GKC_APPLY_LANGUAGES[@]}"
    do
        local ext_variable="config_languages_setting_${element}_ext"
        local ext_config="${!ext_variable//./$empty_string}"
        local ext_config="${ext_config//\"/}"
        local hash_code_prefix="%{hash_code_prefix}"
        local hash_code="%{hash_code}"
        if [[ ${FILENAME##*.} =~ ^($ext_config)$ ]]
        then
            local cmt_variable="config_languages_setting_${element}_cmt"
            local format_cmt="${!cmt_variable}"
            if [[ $format_cmt == *"${HTML_COMMENT_START}"* && $format_cmt == *"${HTML_COMMENT_END}"* ]]
            then
                local format_cmt="${format_cmt//$HTML_COMMENT_START%/$HTML_COMMENT_START %}"
                local format_cmt="${format_cmt//$HTML_COMMENT_END/ $HTML_COMMENT_END}"
            fi
            local format_cmt="${format_cmt//$hash_code_prefix/$GKC_HASHCODE_PREFIX}"
            local format_cmt="${format_cmt//$hash_code/$GKC_HASHCODE}"
            local format_cmt="${format_cmt//\"/}"
            if [[ ${FILENAME##*.} =~ ^(rb)$ ]]
            then
                if grep -q "# frozen_string_literal: true" "$FILENAME"
                then
                    if [[ "$OSTYPE" == "darwin"* ]]; then
                        sed -i '' "s/# frozen_string_literal: true/# frozen_string_literal: true\\$(echo -e '\n\r')${format_cmt}/g" $FILENAME
                    else
                        sed -i "s/# frozen_string_literal: true/# frozen_string_literal: true\n\n${format_cmt}/" $FILENAME
                    fi
                else
                    (echo $format_cmt | cat - $FILENAME)  > "$FILENAME".tmp && mv "$FILENAME".tmp "$FILENAME"
                fi
            else
                (echo $format_cmt | cat - $FILENAME)  > "$FILENAME".tmp && mv "$FILENAME".tmp "$FILENAME"
            fi
            break
        else
            continue
        fi
    done
}

checkout_patterns() {
    GKC_CHECKOUT_PATTERN=""
    for element in "${config_ignore_file_patterns[@]}"
    do
        if [[ $element == */ ]]
        then
            local element="${element::-1}"
        fi
        if [ -z "$GKC_CHECKOUT_PATTERN" ]
        then
            GKC_CHECKOUT_PATTERN+="-path ./$element "
        else
            GKC_CHECKOUT_PATTERN+="-o -path ./$element "
        fi
    done
    GKC_CHECKOUT_PATTERN="${GKC_CHECKOUT_PATTERN//\"/}"
}

get_list_files() {
    HASHCODE=$1
    checkout_patterns
    local file_exts_array=(${GKC_SUPPORT_EXTENTIONS//|/ })
    for element in "${file_exts_array[@]}"
    do
        local tmp_file_regex="${element//\"/}"
        local find_files_by_ext="find $GKC_HASHCODE_FOLDER_PATH -type d \( $GKC_CHECKOUT_PATTERN\) -prune -o -name '*.$tmp_file_regex' -print >> result.tmp.txt"
        eval $find_files_by_ext
    done

    while IFS="" read -r line || [ -n "$line" ]
    do
        local filename="${line/.\//}"
        local match=false
        for checkout_files in "${config_ignore_files[@]}"
        do
            if [ $filename == $checkout_files ]
            then
                local match=true
                break
            fi
        done
        if [ $match == false ]
        then
            if ! grep -q $HASHCODE $filename
            then
                echo $filename >> $GKC_ADD_FILES
            fi
        fi
    done < result.tmp.txt
    rm result.tmp.txt
}

addHashCode() {
    HASHCODE=$1
    # git grep  -L -I --color -n "$HASHCODE" * */*  > $GKC_ADD_FILES
    get_list_files $HASHCODE
    COUNT=0
    while IFS="" read -r line || [ -n "$line" ]
    do
        echo "processing file" $line
        add_gkc_comment_format $line
        COUNT=$(( COUNT + 1 ))
    done < $GKC_ADD_FILES
    echo "${green}$COUNT file has added hashcode $HASHCODE${reset}"
    rm $GKC_ADD_FILES
}

help_info() {
    echo "
    A bash script for helper add GKC version $GKC_HASHCODE_VERSION.

    Usage: bash gkc_util_hashcode_script.bash COMMAND <PARAMS>

    COMMAND:
        add <hashCode>  Add hashCode to all file exclude file/folder from gkc_hashcode_config.yml

    What COMMAND do you choice? "
}

if [ "$GKC_HASHCODE" != "lookAtMeNow" ]
then
    echo "${red}GKC hashcode is added to config file with value $GKC_HASHCODE${reset}"
    addHashCode "$GKC_HASHCODE"
    process_config_file_after_parse
else
    INPUT_STRING="$1"
    PARAM_STRING="$2"
    while :
    do
      case $INPUT_STRING in
        "add")
            if [ -z "$PARAM_STRING" ]
            then
                echo "Please provider hash code"
                read PARAM_STRING
            else
                echo "Adding hash code ... "
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    sed -i '' "s/hash_code: lookAtMeNow/hash_code: $PARAM_STRING/g" $GKC_HASHCODE_CONFIG_FILE
                else
                    sed -i "s/hash_code: lookAtMeNow/hash_code: $PARAM_STRING/" $GKC_HASHCODE_CONFIG_FILE
                fi

                eval "$(parse_yaml)"
                get_gkc_hash_code
                process_config_file_after_parse
                addHashCode $GKC_HASHCODE
                break
            fi
            ;;
        *)
            help_info
            read INPUT_STRING
            ;;
      esac
    done
fi
echo
echo "DONE!"
