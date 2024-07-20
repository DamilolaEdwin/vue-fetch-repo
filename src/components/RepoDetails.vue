<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const repo = reactive({
  name: '',
  description: '',
  stargazers_count: 0,
  forks_count: 0,
  followers: 0,
  following: 0,
  html_url: ''
});

const route = useRoute();

onMounted(() => {
  fetch(`https://api.github.com/repos/${route.params.username}/${route.params.repo}`)
    .then(res => res.json())
    .then(data => {
      Object.assign(repo, data);
    });
});
</script>

<template>
  <div>
    <h2>{{ repo.name }}</h2>
    <p>Description: {{ repo.description }}</p>
    <p>Stars: {{ repo.stargazers_count }}</p>
    <p>Forks: {{ repo.forks_count }}</p>
    <p>Followers: {{ repo.followers }}</p>
    <p></p>
    <a :href="repo.html_url" target="_blank">View on GitHub</a>

  </div>
  <br />
  <p>Click here to go back<RouterLink to="/">Home</RouterLink>
  </p>
</template>
