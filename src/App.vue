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
 <div class="total">
  <header>
    <div class="wrapper">
      <h1>{{ state.userData ? state.userData.name : 'Loading...' }}</h1>
      <h2>GitHub Repositories</h2>
      <nav>
        <!-- <RouterLink to="/">Home</RouterLink> -->
        <!-- <RouterLink to="/about">About</RouterLink> -->
      </nav>
    </div>
  </header>
  <div>
    <RouterView />
  </div>
 </div>
</template>


<style >
body{
  background-color: #87CEEB;
  color:  #333333;

}

h1, h2{
  text-align: center;
  color: #FFFFFF;
}
/* header {
  line-height: 1.5;
  max-height: 100vh;
}



@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  
  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style> 
