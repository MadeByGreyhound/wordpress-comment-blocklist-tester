<script setup>
import {ref, watch} from 'vue';
import {preg_quote} from 'locutus/php/pcre';
import {getBlocklist} from './blocklist';

let message = ref(window.localStorage.getItem('blocklistMessage'));
let results = ref([]);
let blocklist = null;

watch(message, async message => {
    // Save message contents
    window.localStorage.setItem('blocklistMessage', message);
    
    // Reset results when processing new message
    results.value = [];
    
    // Ensure blocklist availability
    if( !blocklist ) {
        blocklist = await getBlocklist();

        if( !blocklist ) {
            alert( 'Failed to retrieve blocklist.' );
            return;
        }
    }
    
    blocklist.forEach(word => {
        if( word ) {
            let regex = new RegExp(preg_quote( word ), 'i');

            if( regex.test( message ) ) {
                results.value.push(word);
            }
        }
    });
}, { immediate: true });
</script>

<template>
    <main class="main">
        <h1 class="title">WordPress Comment Blocklist Tester</h1>
        
        <div class="input">
            <label for="input" class="label">Message content</label>
            <textarea v-model.lazy="message" id="input"></textarea>
        </div>
        
        <div class="results">
            <h2 class="label">Results</h2>
            
            <div class="list">
                <pre class="result" v-for="result in results" v-text="result"></pre>
            </div>
        </div>
    </main>
</template>
