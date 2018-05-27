<template>
  <div class="index container">
    <div class="card" v-for="project in projects" :key="project.id">
      <div class="card-content">
        <i class="material-icons delete" @click="deleteProject(project.id)">delete</i>
        <h2 class="indigo-text">{{ project.title }}</h2>
        <p class="description">{{ project.description }}</p>
        <ul class="skills-required">
          <li v-for="(skill, index) in project.skillsRequired" :key="index">
            <span class="chip">{{ skill }}</span>
          </li>
        </ul>
      </div>
      <span class="btn-floating btn-large halfway-fab pink">
        <router-link :to="{ name: 'EditProject', params: {project_slug: project.slug} }">
          <i class="material-icons edit">edit</i>
        </router-link>
      </span>
    </div>
    
  </div>
</template>

<script>
import db from '@/firebase/init'

export default {
  name: 'Index',
  data () {
    return {
      projects: []
    }
  },
  methods: {
    deleteProject(id) {
      // delete doc from firestore
      db.collection('projects').doc(id).delete()
      .then(() => {
        this.projects = this.projects.filter(project => {
          return project.id != id
        })
      })
    }
  },
  created() {
    // fetch data from firestore
    db.collection('projects').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let project = doc.data()
        project.id = doc.id
        this.projects.push(project)
      })
    })
  }
}
</script>


<style>
.index {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 30px;
  margin-top:  60px;
}
.index .delete {
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: #aaa;
  font-size: 1.4em;
}
.index h2 {
  font-size: 1.8em;
  text-align: center;
  margin-top: 0;
}
.index .description {
  word-break:break-all;
}
.index .skills-required {
  margin: 30px auto;
}
.index .skills-required li {
  display: inline-block;
}
</style>
