import { createArticle, getAllCategories, getTags } from '@/services/van-blog/api';
import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Modal } from 'antd';
import moment from 'moment';
import AuthorField from '../AuthorField';

export default function (props) {
  const { onFinish } = props;
  return (
    <ModalForm
      title="新建文章"
      trigger={
        <Button key="button" type="primary">
          新建文章
        </Button>
      }
      width={450}
      autoFocusFirstInput
      submitTimeout={3000}
      onFinish={async (values) => {
        if (location.hostname == 'blog-demo.mereith.com') {
          Modal.info({
            title: '演示站禁止新建文章！',
            content: '本来是可以的，但有个人在演示站首页放黄色信息，所以关了这个权限了。',
          });
          return;
        }
        const washedValues = {};
        for (const [k, v] of Object.entries(values)) {
          washedValues[k.replace('C', '')] = v;
        }

        await createArticle(washedValues);
        if (onFinish) {
          onFinish();
        }

        return true;
      }}
      layout="horizontal"
      labelCol={{ span: 6 }}
      // wrapperCol: { span: 14 },
    >
      <ProFormText
        width="md"
        required
        id="titleC"
        name="titleC"
        label="文章标题"
        placeholder="请输入标题"
        rules={[{ required: true, message: '这是必填项' }]}
      />
      <AuthorField />
      <ProFormText
        width="md"
        id="topC"
        name="topC"
        label="置顶优先级"
        placeholder="留空或0表示不置顶，其余数字越大表示优先级越高"
      />
      <ProFormSelect
        mode="tags"
        tokenSeparators={[',']}
        width="md"
        name="tagsC"
        label="标签"
        placeholder="请选择或输入标签"
        request={async () => {
          const msg = await getTags();
          return msg?.data?.map((item) => ({ label: item, value: item })) || [];
        }}
      />
      <ProFormSelect
        width="md"
        required
        id="categoryC"
        name="categoryC"
        label="分类"
        placeholder="请选择分类"
        rules={[{ required: true, message: '这是必填项' }]}
        request={async () => {
          const { data: categories } = await getAllCategories();
          return categories?.map((e) => {
            return {
              label: e,
              value: e,
            };
          });
        }}
      />
      <ProFormDateTimePicker
        placeholder="不填默认为此刻"
        name="createdAtC"
        id="createdAtC"
        label="创建时间"
        width="md"
        showTime={{
          defaultValue: moment('00:00:00', 'HH:mm:ss'),
        }}
      />

      <ProFormSelect
        width="md"
        name="privateC"
        id="privateC"
        label="是否加密"
        placeholder="是否加密"
        request={async () => {
          return [
            {
              label: '否',
              value: false,
            },
            {
              label: '是',
              value: true,
            },
          ];
        }}
      />
      <ProFormText.Password
        label="密码"
        width="md"
        id="passwordC"
        name="passwordC"
        autocomplete="new-password"
        placeholder="请输入密码"
        dependencies={['private']}
      />
      <ProFormSelect
        width="md"
        name="hiddenC"
        id="hiddenC"
        label="是否隐藏"
        placeholder="是否隐藏"
        request={async () => {
          return [
            {
              label: '否',
              value: false,
            },
            {
              label: '是',
              value: true,
            },
          ];
        }}
      />
    </ModalForm>
  );
}
