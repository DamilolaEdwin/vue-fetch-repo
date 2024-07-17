<script setup>
import { reactive, onMounted } from 'vue';
import { RouterLink } from 'vue-router';

const state = reactive({
  userData: null,
  repos: [],
  currentPage: 1,
  perPage: 4,
  totalPages: 1
});

const fetchUserData = () => {
  fetch(`https://api.github.com/users/DamilolaEdwin`)
    .then(res => res.json())
    .then(data => {
      state.userData = data;
    });
};

const fetchRepos = () => {
  fetch(`https://api.github.com/users/DamilolaEdwin/repos?per_page=${state.perPage}&page=${state.currentPage}`)
    .then(res => {
      const linkHeader = res.headers.get('Link');
      if (linkHeader) {
        const links = linkHeader.split(',').reduce((acc, link) => {
          const match = link.match(/<(.*)>; rel="(.*)"/);
          acc[match[2]] = match[1];
          return acc;
        }, {});

        state.totalPages = links.last ? new URL(links.last).searchParams.get('page') : state.currentPage;
      } else {
        state.totalPages = state.currentPage;
      }
      return res.json();
    })
    .then(data => {
      state.repos = data;
    });
};

const goToPage = (page) => {
  state.currentPage = page;
  fetchRepos();
};

onMounted(() => {
  fetchUserData();
  fetchRepos();
});
</script>

<template>
  <div>
    <h3>Repositories</h3>
    <ul>
      <li v-for="repo in state.repos" :key="repo.id">
        <RouterLink :to="`/repos/${state.userData.login}/${repo.name}`">{{ repo.name }}</RouterLink>
      </li>
    </ul>
    <div class="pagination">
      <button :disabled="state.currentPage === 1" @click="goToPage(state.currentPage - 1)">Previous</button>
      <span>Page {{ state.currentPage }} of {{ state.totalPages }}</span>
      <button :disabled="state.currentPage === state.totalPages" @click="goToPage(state.currentPage + 1)">Next</button>
    </div>
  </div>
</template>
