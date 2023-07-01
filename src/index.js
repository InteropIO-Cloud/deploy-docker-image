import { getInput, notice } from "@actions/core"
import { exec } from "@actions/exec"

const run = async () => {

    // need set AWS ENV VARS

    const imagesRepo = getInput("images-repo", { required: true }); // 389653476181.dkr.ecr.us-west-1.amazonaws.com -> constant ->
    const region = getInput("region", { required: true });
    const workingDir = getInput("working-dir", { required: true });
    const tagName = getInput("tag-name", { required: true });
    const serviceRepositoryUri = getInput("repository-uri", { required: true });
    const serviceDockerFile = getInput("service-docker-file", { required: true });

    await exec(`aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${imagesRepo}`);

    notice("Authenticated with AWS ECR successfully.");

    const dockerFile = join(workingDir, serviceDockerFile);

    notice(`Building docker image ${serviceRepositoryUri} with tag ${tagName} from ${dockerFile} in ${workingDir}.`);

    await exec(`docker build --build-arg BUILD_ENV=prod -t ${serviceRepositoryUri}:${tagName} -f ${dockerFile} ${workingDir}`);

    notice(`Pushing docker image ${serviceRepositoryUri} with tag ${tagName} to ${imagesRepo}.`);

    await exec(`docker push ${serviceRepositoryUri}:${tagName}`);

    notice(`Pushed docker image ${serviceRepositoryUri} with tag ${tagName} successfully.`);
};

run();
