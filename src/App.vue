<template>
  <div id="app" class="md-layout md-alignment-top-center">
    <div
      id="nav"
      class="md-layout-item md-xsmall-size-95 md-small-size-80 md-size-70"
    >
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/black-card-manager">Carte Nere</router-link> |
      <router-link to="/white-card-manager">Carte Bianche</router-link>
    </div>
    <router-view
      class="md-layout-item md-xsmall-size-95 md-small-size-80 md-size-70"
    />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
