<template>
  <div class="editer-container" ref="container"></div>
</template>
<script>
/* eslint-disable */
import { Lodash, Utils } from '@public/utils'
import { loader } from "vue-m-loader";
const { isJsonString } = Utils
const conf = {
  // 小地图
  minimap: { enabled: false },
  // 启用代码折叠默认值为true。
  folding: true,
  // 语言
  // ["apex", "azcli", "bat", "c", "clojure", "coffeescript",
  // "cpp", "csharp", "csp", "css", "dockerfile", "fsharp", "go", "graphql",
  // "handlebars", "html", "ini", "java", "javascript", "json", "kotlin", "less",
  // "lua", "markdown", "msdax", "mysql", "objective-c", "pascal", "perl", "pgsql", "php",
  // "plaintext", "postiats", "powerquery", "powershell", "pug", "python", "r", "razor", "redis",
  // "redshift", "ruby", "rust", "sb", "scheme", "scss", "shell", "sol", "sql", "st", "swift", "tcl",
  // "typescript", "vb", "xml", "yaml"]
  language: "plaintext",
  // 右键功能
  contextmenu: false,
  // 启用当前行突出显示。 默认 all。 "none"|"gutter"|"line"|"all"
  renderLineHighlight: "all",
  // 主题 vs, hc-black, or vs-dark
  theme: "vs-dark",
  // 单击行号时是否应选择相应的行？ 默认为true。
  selectOnLineNumbers: true,
  // 使用圆角边框渲染编辑器选择。 默认为true。
  roundedSelection: true,
  // 只读
  readOnly: false,
  // 控制光标样式 'block' or 'line'.	Defaults to 'line'.
  cursorStyle: "line",
  //自动布局 启用编辑器将安装间隔以检查其容器dom节点大小是否已更改。 启用此功能可能会对性能产生严重影响。 默认为false。
  automaticLayout: false,
  // 启用字形边距的渲染。 在vscode中默认为true，在monaco-editor中默认为false。
  glyphMargin: true,
  // 在制表位后插入和删除空格。
  useTabStops: true,
  //字体大小
  fontSize: 12,
  // 启用自动缩进调整。 默认为false。
  autoIndent: true,
  // 快速建议显示
  quickSuggestions: false,
  // 快速建议显示延迟（以毫秒为单位）默认为500（毫秒）
  quickSuggestionsDelay: 500
};
import { mapState } from "vuex";
export default {
  props: {
    value: {
      type: [String, Object, Array],
      default: () => {
        return "";
      }
    },
    online: {
      type: Boolean,
      default: false
    },
    editorOptions: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      monacoEditor: null,
      cdnURL: ""
    };
  },
  created() {
    this.cdnURL = this.online ? "https://cdn.bootcss.com/monaco-editor/0.17.0/min/vs" : this.setting.server + "/webCdnPkg/monaco-editor/min/vs";
    this.$nextTick(() => {
      this.initEditor()
    })
  },
  computed: {
    ...mapState(["setting"]),
    config() {
      return Object.assign({}, conf, this.editorOptions);
    },
    valueClone () {
      if (typeof this.value === "null") return ''
      if (this.config.language === "json" && typeof this.value === "object") {
        return JSON.stringify(this.value, null, 2);
      } else {
        return this.value;
      }
    }
  },
  methods: {
    loadLibrary() {
      return new Promise((resolve, reject) => {
        if (window.monaco) return resolve();
        loader({
          url: this.cdnURL + "/loader.js",
          library: "require"
        }).then(library => {
          library.target.config({
            paths: { vs: this.cdnURL }
          });
          library.target(["vs/editor/editor.main"], () => {
            if (window.monaco) return resolve();
            else reject();
          });
        });
      });
    },
    setEditorValue: Lodash.debounce(function (data, mEditor) {
      if (
        this.config.language === "json" &&
        isJsonString(data)
      ) {
        this.$emit("onChange", JSON.parse(data), mEditor);
        this.$emit("input", JSON.parse(data), mEditor);
      } else {
        this.$emit("onChange", data, mEditor);
        this.$emit("input", data, mEditor);
      }
    }, 600, {leading: false}),
    initEditor() {
      this.loadLibrary().then(() => {
        const monaco = window.monaco;
        if (this.monacoEditor) {
          this.monacoEditor.dispose && this.monacoEditor.dispose()
        }
        try {
          this.monacoEditor = monaco.editor.create(this.$refs.container, {
          value: this.valueClone,
            ...this.config
          });
          const mEditor = this.monacoEditor;
          //编辑器创建完成回调
          this.$emit("onMounted", mEditor);
          // onDidBlurEditorWidget
          // onDidBlurEditor
          // onDidFocusEditor
          // onDidLayoutChange
          // onDidChangeModelContent
          mEditor.onDidBlurEditorWidget(event => {
            if (!mEditor) return;
            let data = mEditor.getValue();
            this.setEditorValue(data, mEditor)
          });
        } catch (error) {
          console.error(error)
        }
      });
    }
  },
  watch: {
    valueClone: {
      handler (n, o) {
        this.monacoEditor && this.monacoEditor.setValue(this.valueClone)
      }
    }
  },
  beforeDestroy() {
    if (this.monacoEditor) {
      this.monacoEditor.dispose && this.monacoEditor.dispose()
    }
    this.monacoEditor = null;
  }
};
</script>
<style scoped lang="less">
.editer-container {
  width: 100%;
  height: 100%;
  /deep/ .monaco-editor {
    background: #00172e;
    .margin {
      background: #00172e;
    }
  }
}
</style>