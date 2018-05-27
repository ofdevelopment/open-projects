<template>
    <div v-if="project" class="edit-project container z-depth-1">
        <h2>Edit {{ project.title }}</h2>
        <form @submit.prevent="editProject">
        <div class="field title">
            <label for="title">Project title:</label>
            <input type="text" name="title" v-model="project.title">
        </div>
        <div class="field description">
          <label for="description">Description</label>
          <textarea id="description" class="materialize-textarea" v-model="project.description" data-length="120"></textarea>
      </div>
        <div class="field skills-required">
            <label v-if="project.skillsRequired.length">Selected Skills:</label>
            <ul class="skills-required">
                    <li v-for="(skillchip, index) in project.skillsRequired" :key="index">
                        <div class="chip">
                            {{ skillchip }}
                            <i class="close material-icons" @click="removeSkill(skillchip)">close</i>
                        </div>
                    </li>
            </ul>
        </div>
        <div class="field add-skill">
            <label for="add-skill">Add skills (press tab to add):</label>
            <input type="text" name="add-skill" @keydown.tab.prevent="addSkill" v-model="another">
        </div>
        <div class="field center-align">
            <p v-if="feedback" class="red-text">{{ feedback }}</p>
            <button class="btn pink">Update Project</button>
        </div>
        </form>
    </div>
</template>

<script>
import db from '@/firebase/init'
import slugify from 'slugify'


export default {
    name: 'EditProject',
    data() {
        return {
            project: null,
            another: null,
            feedback: null
        }
    },
    methods: {
        editProject() {
            if (this.project.title) {
                this.feedback = null
                // create slug
                this.project.slug = slugify(this.project.title, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })
                db.collection('projects').doc(this.project.id).update({
                    title: this.project.title,
                    description: this.project.description,
                    skillsRequired: this.project.skillsRequired,
                    slug: this.project.slug
                }).then(() => {
                    this.$router.push({ name: 'Index'})
                }).catch(err => {
                    console.log(err)
                })
            } else {
                this.feedback = 'You must enter a project title'
            }
        },
        addSkill() {
            if(this.another) {
                this.project.skillsRequired.push(this.another)
                this.another = null
                this.feedback = null
            } else {
                this.feedback = 'You must enter a value to add a skill'
            }
        },
        removeSkill(skillchip) {
            this.project.skillsRequired = this.project.skillsRequired.filter(skill => {
                return skill != skillchip
            })
        }
    },
    created() {
        let ref = db.collection('projects').where('slug', '==', this.$route.params.project_slug)
        ref.get().then(snapshot => {
            snapshot.forEach(doc => {
                this.project = doc.data()
                this.project.id = doc.id
            })
        })
    }
}
</script>

<style>
.edit-project {
    margin-top: 60px;
    padding:  20px;
    max-width: 500px;
}
.edit-project h2 {
    font-size: 2em;
    margin: 20px auto;
}
.edit-project .field {
    margin: 20px;
}
.edit-project .skills-required {
  margin: 10px auto;
}
.edit-project .skills-required li {
  display: inline-block;
}
</style>
