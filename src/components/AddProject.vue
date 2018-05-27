<template>
  <div class="add-project container z-depth-1">
    <h2 class="center-align indigo-text">Add a New Project</h2>
    <form @submit.prevent="addProject">
      <div class="field title">
        <label for="title">Project title:</label>
        <input type="text" name="title" v-model="title">
      </div>
      <div class="field description">
          <label for="description">Description</label>
          <textarea id="description" class="materialize-textarea" v-model="description" data-length="200"></textarea>
          <p class='right-align text-small'>{{ description.length }}/{{ maxDescriptionCount }}</p>
      </div>
      <div class="field skills-added">
          <label v-if="skills.length">Skills Added:</label>
          <ul class="skills-required">
                <li v-for="(skillchip, index) in skills" :key="index">
                    <div class="chip">
                        {{ skillchip }}
                        <i class="close material-icons" @click="removeSkill(skillchip)">close</i>
                    </div>
                </li>
          </ul>
      </div>
      <div class="field add-skill">
        <label for="add-skill">Add Skills Required (press tab to add):</label>
        <input type="text" name="add-skill" @keydown.tab.prevent="addSkill" v-model="another">
      </div>
      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn pink">Add Project</button>
      </div>
    </form>
  </div>
</template>


<script>
import db from '@/firebase/init'
import slugify from 'slugify'

export default {
    name: 'AddProject',
    data() {
        return {
            title: null,
            description: '',
            maxDescriptionCount: 200,
            another: null,
            skills: [],
            feedback: null,
            slug: null
        }
    },
    methods: {
        addProject() {
            if (this.description.length >= this.maxDescriptionCount) {
                this.feedback = 'You must enter less description'
            } else if (!this.title) {
                this.feedback = 'You must enter a project title'
            } else {
                this.feedback = null
                // create slug
                this.slug = slugify(this.title, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })
                db.collection('projects').add({
                    title: this.title,
                    description: this.description,
                    skillsRequired: this.skills,
                    slug: this.slug
                }).then(() => {
                    this.$router.push({ name: 'Index'})
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        addSkill() {
            if(this.another) {
                this.skills.push(this.another)
                this.another = null
                this.feedback = null
            } else {
                this.feedback = 'You must enter a value to add a skill'
            }
        },
        removeSkill(skillchip) {
            this.skills = this.skills.filter(skill => {
                return skill != skillchip
            })
        }
    },
    created() {

    }
}
</script>

<style>
.add-project {
    margin-top: 60px;
    padding:  20px;
    max-width: 500px;
}
.add-project h2 {
    font-size: 2em;
    margin: 20px auto;
}
.add-project .field {
    margin: 20px;
}
.add-project .skills-required {
  margin: 10px auto;
}
.add-project .skills-required li {
  display: inline-block;
}
.add-project .text-small {
  font-size: 0.8em;
}
</style>
