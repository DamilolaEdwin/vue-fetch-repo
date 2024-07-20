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
  <div class="page">
    <div class="">
      <div class="box" v-for="repo in state.repos" :key="repo.id">
        <h2>
          <RouterLink :to="`/repos/${state.userData.login}/${repo.name}`">{{ repo.name }}</RouterLink>
        </h2>
        <p>Description: {{ repo.description }}</p>
      </div>
    </div>
    <div class="pagination">
      <button :disabled="state.currentPage === 1" @click="goToPage(state.currentPage - 1)">Previous</button>
      <span>Page {{ state.currentPage }} of {{ state.totalPages }}</span>
      <button :disabled="state.currentPage === state.totalPages" @click="goToPage(state.currentPage + 1)">Next</button>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
}

.box {
  width: 300px;
  height: 300px;
  border: solid 1px #fff;
  padding: 10px;
  margin: 20px;
  text-align: center;
  margin-inline-start: 150px;
  font-size: 200;

  background-color: #FFFFFF;
  border: 1px solid #D3D3D3;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1rem;
  transition: transform 0.2s;
}

.box:hover {
  transform: translateY(-5px);
}

p {
  color: #87CEEB;
  margin-bottom: 1rem;
}
</style>