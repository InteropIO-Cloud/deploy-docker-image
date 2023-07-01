# Deploy Docker Image Github Action

This action is designed to be used in the io.Cloud CD pipeline to build and deploy the docker image of io.Cloud instance service.

In addition to the required inputs, this action requires three environment variables to be set: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION`. These are used to authenticate with AWS ECR and push the docker image to the ECR repository.

Usage:
```yaml
- name: Deploy Service Image
  uses: interopio-cloud/deploy-docker-image@1.0.1
    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      AWS_REGION: ${{ secrets.AWS_REGION }}
    with:
      tag-name: ${{ github.event.release.tag_name }}
      region: ${{ secrets.AWS_REGION }}
      working-dir: ${{ github.workspace }}
      images-repo: 389653476181.dkr.ecr.us-west-1.amazonaws.com
      service-repository-uri: 389653476181.dkr.ecr.us-west-1.amazonaws.com/acme-wealth/admin
      service-docker-file: ./services/admin/Dockerfile
```

The action either exits with 0, if the docker image was successfully built and deployed, or 1 if not.
