<template>
  <div>
    <el-form :model="pic" :rules="rules" ref="pic" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input  v-model="pic.name" placeholder="请输入用户名称"></el-input>
      </el-form-item>
      <el-form-item required label="分类" prop="type">
        <PicTypeSelect v-model="pic.type" />
      </el-form-item>
      <el-form-item label="简介" prop="intro">
        <el-input type="textarea" v-model="pic.intro" placeholder="相片简介"></el-input>
      </el-form-item>
      <el-form-item required label="相片" prop="pictures">
        <el-upload
          action="/server/upload"
          list-type="picture-card"
          name="files"
          multiple
          accept="/image/*"
          :file-list="pic.pictures"
          :http-request="handleUploaded"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemovePic">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('pic')">立即创建</el-button>
        <el-button @click="resetForm('pic')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>

</template>

<script>
import PicTypeSelect from '@/components/PicTypeSelect'

export default {
  name: 'PhotoAdd',

  components: {
    PicTypeSelect
  },

  data () {
    const validateArray = (rule, value, callback) => {
      if (value.length) {}
      return value.length ? callback() : callback(new Error(rule.message))
    }

    return {
      pic: {
        name: '',
        type: [],
        intro: '',
        pictures: []
      },
      dialogVisible: false,
      dialogImageUrl: '',
      headers: { 'authorization': sessionStorage.getItem('V_accessToken') },
      rules: {
        name: [{ required: true, message: '请输入相片名称', trigger: 'blur' }],
        pictures: [{ validator: validateArray, message: '请添加照片', trigger: 'blur' }],
        type: [{ validator: validateArray, message: '请选择相片分类', trigger: 'blur' }]
      }
    }
  },

  methods: {
    handleUploaded (data) {
      const imgData = new FormData()
      imgData.append(data.filename, data.file)
      this.$fetch({
        url: data.action,
        type: 'POST',
        data: imgData
      }).then(res => {
        const { id, path } = res.data
        this.pic.pictures.push({
          id,
          url: path
        })
      }).catch(_ => {
        this.pic.pictures = [...this.pic.pictures]
      })
    },

    handleRemovePic (file, fileList) {
      this.pic.pictures = fileList
    },

    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) { return false }

        this.$fetch({
          url: '/server/photo',
          type: 'POST',
          data: {
            ...this.pic,
            pictures: this.pic.pictures.map(item => item.id)
          }
        }).then(res => {
          this.$tab.close()
          this.$tab.reload('/photo/list')
          this.$tab.open('/photo/list')
        })
      })
    },

    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
