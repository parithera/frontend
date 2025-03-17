<script setup lang="ts">
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import LinkTool from '@editorjs/link';
import SimpleImage from '@editorjs/simple-image';
import Checklist from '@editorjs/checklist';
import Embed from '@editorjs/embed';
import List from '@editorjs/list';
import CodeTool from '@editorjs/code';
import { onMounted } from 'vue';

onMounted(() => {
    const editorJS = new EditorJS({
        /**
         * Id of Element that should contain the Editor
         */
        holder: 'editorjs',
        tools: {
            header: {
                class: Header,
                shortcut: 'CMD+SHIFT+H',
                config: {
                    placeholder: 'Enter a header',
                    levels: [1, 2, 3, 4],
                    defaultLevel: 1
                }
            },
            linkTool: LinkTool,
            image: SimpleImage,
            list: List,
            checklist: {
                class: Checklist,
                inlineToolbar: true
            },
            embed: Embed,
            code: CodeTool
        }
        // placeholder: "Let's write an awesome report!"
    });
});
</script>
<template>
    <div id="editorjs"></div>
</template>

<style lang="scss">
h1.ce-header {
    font-size: xx-large;
    font-weight: 900;
}

h2.ce-header {
    font-size: x-large;
    font-weight: 700;
}

h3.ce-header {
    font-size: large;
    font-weight: 700;
}

h4.ce-header {
    font-size: medium;
    font-weight: 700;
}

h5.ce-header {
    font-weight: 700;
}

h6.ce-header {
    font-weight: 700;
}
</style>
